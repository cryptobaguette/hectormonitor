import { ContextSimulator } from 'bottender/test-utils';
import { handler } from '../index';

const simulator = new ContextSimulator({
  platform: 'telegram',
});

it('should work', async () => {
  const context = simulator.createTextContext('Awesome');
  await handler(context);
  expect(context.sendText).toMatchSnapshot();
});
