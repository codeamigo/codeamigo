import fetch from 'node-fetch';
import { ITemplate } from 'src/utils/templates';

export async function getTemplateFromStackblitz(
  id: string
): Promise<Omit<ITemplate, 'templateName'>> {
  try {
    const response = await fetch(`https://stackblitz.com/edit/${id}`);
    const text = await response.text();
    const scriptContents = text
      .split(
        '<script type="application/json" data-js-react-on-rails-store="appStore">'
      )[1]
      .split('</script>')[0];

    const { project } = JSON.parse(scriptContents);
    const {
      appFiles,
    }: {
      appFiles: {
        [key in string]: {
          name: string;
          type: string;
          contents: string;
          fullPath: string;
        };
      };
    } = project;

    const codeModules = Object.keys(appFiles)
      .filter((file) => appFiles[file].type === 'file')
      .map((key) => ({
        isEntry: key === 'README.md',
        name: '/' + key,
        value: appFiles[key].contents,
      }));

    console.log(codeModules);

    return {
      codeModules,
      executionType: 'stackblitz',
      lang: 'javascript',
    };
  } catch (e) {
    return Promise.reject(e);
  }
}
