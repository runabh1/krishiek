import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: "AIzaSyCwFSWABo-zQbD5ERC2qmJjjKQQSSxLe30"})],
  model: 'googleai/gemini-2.5-flash',
});
