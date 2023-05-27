const debouncePromise = (fn: any, ms = 0) => {
  let timeoutId: NodeJS.Timeout;
  const pending: any[] = [];
  return (...args: any) =>
    new Promise((res, rej) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentPending = [...pending];
        pending.length = 0;
        Promise.resolve(fn.apply(this, args)).then(
          (data) => {
            currentPending.forEach(({ resolve }) => resolve(data));
          },
          (error) => {
            currentPending.forEach(({ reject }) => reject(error));
          }
        );
      }, ms);
      pending.push({ reject: rej, resolve: res });
    });
};

export default debouncePromise;
