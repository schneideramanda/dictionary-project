import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signUpAction } from '@/app/actions/auth';
import { toast } from 'sonner';
import SignUp from './page';

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
  signUpAction: jest.fn(),
}));
const signUpActionMock = signUpAction as jest.MockedFunction<typeof signUpAction>;

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
  {
    name,
    email,
    password,
    confirmPassword,
  }: { name?: string; email?: string; password?: string; confirmPassword?: string },
) {
  if (name !== undefined) {
    await user.type(screen.getByLabelText('Name'), name);
  }
  if (email !== undefined) {
    await user.type(screen.getByLabelText('Email'), email);
  }
  if (password !== undefined) {
    await user.type(screen.getByLabelText('Password'), password);
  }
  if (confirmPassword !== undefined) {
    await user.type(screen.getByLabelText('Confirm Password'), confirmPassword);
  }
  await user.click(screen.getByRole('button', { name: /sign up/i }));
}

// Setup

beforeEach(() => {
  jest.clearAllMocks();
  signUpActionMock.mockResolvedValue({ error: null });
});

// Tests

describe('SignUp', () => {
  it('renders the name, email, password and confirm password fields and a disabled submit button initially', () => {
    render(<SignUp />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();
  });

  it('renders a link to the sign-in page', () => {
    render(<SignUp />);

    const link = screen.getByRole('link', { name: 'Sign In' });
    expect(link).toHaveAttribute('href', '/sign-in');
  });

  it('shows a required error when the name is left empty after being touched', async () => {
    const user = userEvent.setup();
    render(<SignUp />);

    const nameInput = screen.getByLabelText('Name');
    await user.click(nameInput);
    await user.tab();

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
  });

  it('shows a validation error and keeps the button disabled when the email is invalid', async () => {
    const user = userEvent.setup();
    render(<SignUp />);

    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'not-an-email');
    await user.tab();

    expect(await screen.findByText(/invalid/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();
    });
  });

  it('shows a required error when the password is left empty after being touched', async () => {
    const user = userEvent.setup();
    render(<SignUp />);

    const passwordInput = screen.getByLabelText('Password');
    await user.click(passwordInput);
    await user.tab();

    expect(
      await screen.findByText('Password must be at least 8 characters long'),
    ).toBeInTheDocument();
  });

  it('shows an error when the passwords do not match', async () => {
    const user = userEvent.setup();
    render(<SignUp />);

    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), '123Password!');
    await user.tab();

    expect(await screen.findByText(`Passwords don't match`)).toBeInTheDocument();
  });

  it('enables the submit button once fields are valid', async () => {
    const user = userEvent.setup();
    render(<SignUp />);

    await user.type(screen.getByLabelText('Name'), 'Jane');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign up/i })).toBeEnabled();
    });
  });

  it('calls signUpAction with form values, revalidates the user, and redirects on success', async () => {
    const user = userEvent.setup();
    render(<SignUp />);

    await fillAndSubmit(user, {
      name: 'Jane',
      email: 'jane@example.com',
      password: 'Secret123!',
      confirmPassword: 'Secret123!',
    });

    await waitFor(() => {
      expect(signUpActionMock).toHaveBeenCalledWith({
        name: 'Jane',
        email: 'jane@example.com',
        password: 'Secret123!',
        confirmPassword: 'Secret123!',
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
});
