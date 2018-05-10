import { ContextSimulator } from 'bottender/test-utils';
import mockingoose from 'mockingoose';
import { handler } from '../../index';
import { getPoolApi } from '../../../api';

jest.mock('../../../api');

const mockedPoolApi = getPoolApi(null as any);

const simulator = new ContextSimulator({
  platform: 'telegram',
});
const from = {
  id: 42,
};

describe('add command', () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  it('should reply invalid message when no arguments', async () => {
    const context = simulator.createTextContext('/add');
    await handler(context);
    expect(context.sendText).toMatchSnapshot();
  });

  it('should reply invalid message when no enough arguments', async () => {
    const context = simulator.createTextContext('/add eth');
    await handler(context);
    expect(context.sendText).toMatchSnapshot();
  });

  it('should reply invalid message when invalid coin', async () => {
    const context = simulator.createTextContext('/add bla bla bla');
    await handler(context);
    expect(context.sendText).toMatchSnapshot();
  });

  it('should reply invalid message when invalid pool', async () => {
    const context = simulator.createTextContext('/add eth bla bla');
    await handler(context);
    expect(context.sendText).toMatchSnapshot();
  });

  it('should reply invalid message when coin is not supported', async () => {
    (mockedPoolApi.isCoinSupported as jest.Mock).mockReturnValueOnce(false);
    const context = simulator.createTextContext('/add etc ethermine bla');
    context.from = from;
    await handler(context);
    expect(getPoolApi).toBeCalledWith('ethermine');
    expect(mockedPoolApi.isCoinSupported).toBeCalledWith('etc');
    expect(context.sendText).toMatchSnapshot();
  });

  it('should reply invalid message when invalid address from api', async () => {
    (mockedPoolApi.isAdressValid as jest.Mock).mockReturnValueOnce(false);
    const context = simulator.createTextContext(
      '/add eth ethermine ivalidAddress'
    );
    context.from = from;
    await handler(context);
    expect(getPoolApi).toBeCalledWith('ethermine');
    expect(mockedPoolApi.isAdressValid).toBeCalledWith('eth', 'ivalidAddress');
    expect(context.sendText).toBeCalledWith('Invalid address');
  });

  it('should create a new user if it does not exist', async () => {
    mockingoose.User.toReturn(null, 'findOne');
    const context = simulator.createTextContext(
      '/add eth ethermine ivalidAddress'
    );
    context.event.message.from = from;
    await handler(context);
    expect(getPoolApi).toBeCalledWith('ethermine');
    expect(mockedPoolApi.isAdressValid).toBeCalledWith('eth', 'ivalidAddress');
    // TODO find a way to see that user.save has been called
  });

  it('should reply invalid message is address already exist', async () => {
    mockingoose.User.toReturn(null, 'findOne');
    mockingoose.Address.toReturn({}, 'findOne');
    const context = simulator.createTextContext(
      '/add eth ethermine ivalidAddress'
    );
    context.event.message.from = from;
    await handler(context);
    expect(mockedPoolApi.isAdressValid).toBeCalledWith('eth', 'ivalidAddress');
    expect(context.sendText).toMatchSnapshot();
  });

  it('should create an address and reply success message', async () => {
    const context = simulator.createTextContext(
      '/add eth ethermine ivalidAddress'
    );
    context.event.message.from = from;
    await handler(context);
    expect(mockedPoolApi.isAdressValid).toBeCalledWith('eth', 'ivalidAddress');
    expect(context.sendText).toMatchSnapshot();
  });
});
