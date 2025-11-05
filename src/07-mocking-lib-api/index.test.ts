import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

const baseUrl = 'https://jsonplaceholder.typicode.com';
const path = 'posts/1';

describe('throttledGetDataFromApi', () => {
  const mockData = { data: { id: 1, title: 'test' } };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.runOnlyPendingTimers();
    jest.mocked(axios.create).mockReturnValue(axios);
    jest.mocked(axios.get).mockResolvedValue(mockData);
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(baseUrl);

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: baseUrl,
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(path);

    expect(axios.get).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi(path);

    expect(result).toEqual(mockData.data);
  });
});
