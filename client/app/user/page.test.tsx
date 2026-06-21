// Mocks

import { useCurrentUser } from '@/hooks/useUser';
import UserDetail from './page';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock('@/hooks/useUser', () => ({
  useCurrentUser: jest.fn(),
}));
const useCurrentUserMock = useCurrentUser as jest.MockedFunction<typeof useCurrentUser>;

// Helpers

function makeUserResult(
  overrides: Partial<ReturnType<typeof useCurrentUserMock>> = {},
): ReturnType<typeof useCurrentUserMock> {
  return {
    user: {
      id: 'd8dacfe2-f851-4aa7-8682-b65dc240cc11',
      name: 'John Doe',
      email: 'john@doe.com',
    },
    error: undefined,
    isLoading: false,
    isUnauthenticated: false,
    mutate: jest.fn(),
    ...overrides,
  };
}

// Setup

beforeEach(() => {
  jest.clearAllMocks();
  useCurrentUserMock.mockReturnValue(makeUserResult());
});

// Tests

describe('User Detail', () => {
  it('renders the user information', () => {
    render(<UserDetail />);

    expect(screen.getByText('d8dacfe2-f851-4aa7-8682-b65dc240cc11')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@doe.com')).toBeInTheDocument();
  });

  it('renders the history button and navigates to /entries/history when clicked', async () => {
    const user = userEvent.setup();
    render(<UserDetail />);

    const historyButton = screen.getByRole('button', { name: /history/i });
    expect(historyButton).toBeDefined();

    await user.click(historyButton as HTMLElement);

    expect(pushMock).toHaveBeenCalledWith('/entries/history');
  });

  it('renders the favorites button and navigates to /entries/favorites when clicked', async () => {
    const user = userEvent.setup();
    render(<UserDetail />);

    const historyButton = screen.getByRole('button', { name: /favorites/i });
    expect(historyButton).toBeDefined();

    await user.click(historyButton as HTMLElement);

    expect(pushMock).toHaveBeenCalledWith('/entries/favorites');
  });
});
