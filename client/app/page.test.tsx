import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEntries } from '@/hooks/useEntries';
import Home from './page';

// Mocks

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock('@/hooks/useEntries', () => ({
  useEntries: jest.fn(),
}));
const useEntriesMock = useEntries as jest.MockedFunction<typeof useEntries>;

jest.mock('@/components/entry-list', () => ({
  __esModule: true,
  default: () => null,
}));

// Helpers

const setPageMock = jest.fn();

function makeEntriesResult(
  overrides: Partial<ReturnType<typeof useEntries>> = {},
): ReturnType<typeof useEntries> {
  return {
    data: {
      results: [],
      totalDocs: 0,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
    error: undefined,
    isLoading: false,
    page: 1,
    setPage: setPageMock,
    mutate: jest.fn(),
    ...overrides,
  };
}

// Setup

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  useEntriesMock.mockReturnValue(makeEntriesResult());
});

afterEach(() => {
  jest.useRealTimers();
});

// Tests

describe('Home', () => {
  it('renders the search input and history button', () => {
    render(<Home />);

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(1);
  });

  it('updates the search input value immediately as the user types', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);

    const input = screen.getByPlaceholderText('Search...');
    await act(async () => {
      await user.type(input, 'hello');
    });

    expect(input).toHaveValue('hello');
  });

  it('does not call useEntries with the new search term before the debounce delay elapses', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);

    const input = screen.getByPlaceholderText('Search...');
    await act(async () => {
      await user.type(input, 'tea');
    });

    expect(useEntriesMock).not.toHaveBeenCalledWith(expect.objectContaining({ search: 'tea' }));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(useEntriesMock).toHaveBeenCalledWith(expect.objectContaining({ search: 'tea' }));
    });
  });

  it('resets the page to 1 once the debounced search value changes', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);

    await waitFor(() => expect(setPageMock).toHaveBeenCalledWith(1));
    setPageMock.mockClear();

    const input = screen.getByPlaceholderText('Search...');
    await act(async () => {
      await user.type(input, 'a');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(setPageMock).toHaveBeenCalledWith(1);
    });
  });

  it('navigates to /entries/history when the history button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);

    const historyButton = screen.getByRole('button', { name: /history/i });
    expect(historyButton).toBeDefined();

    await user.click(historyButton as HTMLElement);

    expect(pushMock).toHaveBeenCalledWith('/entries/history');
  });
});
