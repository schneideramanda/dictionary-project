import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from '@/app/sign-in/page';
import { signInAction } from '@/app/actions/auth';
import { toast } from 'sonner';

// Mocks

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: React.ComponentProps<'a'>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
}));

jest.mock('@/app/actions/auth', () => ({
  signInAction: jest.fn(),
}));
const signInActionMock = signInAction as jest.MockedFunction<typeof signInAction>;

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));
const toastErrorMock = toast.error as jest.MockedFunction<typeof toast.error>;

const mutateMock = jest.fn();
jest.mock('swr', () => ({
  useSWRConfig: () => ({ mutate: mutateMock }),
}));

// Helpers

async function fillAndSubmit(
  user: ReturnType<typeof userEvent.setup>,
  { email, password }: { email?: string; password?: string },
) {
  if (email !== undefined) {
    await user.type(screen.getByLabelText('Email'), email);
  }
  if (password !== undefined) {
    await user.type(screen.getByLabelText('Password'), password);
  }
  await user.click(screen.getByRole('button', { name: /sign in/i }));
}

// Setup

beforeEach(() => {
  jest.clearAllMocks();
  signInActionMock.mockResolvedValue({ error: null });
});

// Tests

describe('SignIn', () => {
  it('renders the email and password fields and a disabled submit button initially', () => {
    render(<SignIn />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });

  it('renders a link to the sign-up page', () => {
    render(<SignIn />);

    const link = screen.getByRole('link', { name: 'Sign Up' });
    expect(link).toHaveAttribute('href', '/sign-up');
  });

  it('shows a validation error and keeps the button disabled when the email is invalid', async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'not-an-email');
    await user.tab();

    expect(await screen.findByText(/invalid/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
    });
  });

  it('shows a required error when the password is left empty after being touched', async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    const passwordInput = screen.getByLabelText('Password');
    await user.click(passwordInput);
    await user.tab();

    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('enables the submit button once both fields are valid', async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled();
    });
  });

  it('calls signInAction with form values, revalidates the user, and redirects on success', async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    await fillAndSubmit(user, { email: 'jane@example.com', password: 'secret123' });

    await waitFor(() => {
      expect(signInActionMock).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: 'secret123',
      });
    });

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith('/user/me');
    });
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/');
    });

    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it('shows an error toast and does not redirect when signInAction returns an error', async () => {
    signInActionMock.mockResolvedValue({ error: 'Invalid email or password' });
    const user = userEvent.setup();
    render(<SignIn />);

    await fillAndSubmit(user, { email: 'jane@example.com', password: 'wrongpassword' });

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Invalid email or password');
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });
});
