import {CaptureInteractionIterator} from '@useoptic/cli-shared/build/captures/avro/file-system/interaction-iterator';
import path from 'path';

async function main(config: { captureDirectory: string }) {

  const pathComponents = config.captureDirectory.split(path.sep);

  const captureId = pathComponents[pathComponents.length - 1];
  const captureBaseDirectory = pathComponents.slice(0, -1).join(path.sep);
  console.log({
    captureId,
    captureBaseDirectory
  });
  const interactionsIterator = CaptureInteractionIterator({
    captureBaseDirectory,
    captureId
  }, item => {
    // here you can filter out interactions so they won't appear in the loop below
    console.log({item});
    return true;
  });


  for await (const item of interactionsIterator) {
    if (!item.interaction) {
      return
    }
    const {request, response} = item.interaction.value;
    console.log(request.method, request.path, response.statusCode);
    console.log(request.body.contentType && request.body.value.asJsonString)
    console.log(response.body.contentType && response.body.value.asJsonString)
  }
}

const [, , captureDirectory] = process.argv;
main({captureDirectory});