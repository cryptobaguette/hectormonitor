import { ContextSimulator } from 'bottender/test-utils';
import { handler } from '../../index';

const simulator = new ContextSimulator({
  platform: 'telegram',
});

describe('command help', () => {
  it('should reply help message', async () => {
    const context = simulator.createTextContext('/help');
    await handler(context);
    expect(context.sendText).toMatchSnapshot();
  });
});
