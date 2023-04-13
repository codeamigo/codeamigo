import React from 'react';

const ImageToBase64: React.FC<Props> = () => {
  const encodeImageFileAsURL = (e: any) => {
    var file = e.currentTarget.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      console.log('RESULT', reader.result);
      //   @ts-ignore
      document.getElementById('result').innerHTML = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input onChange={(e) => encodeImageFileAsURL(e)} type="file" />
      <div className="break-words text-white" id="result" />
    </div>
  );
};

type Props = {};

export default ImageToBase64;
