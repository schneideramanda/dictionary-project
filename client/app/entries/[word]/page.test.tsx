import { useEntry } from '@/hooks/useEntries';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WordDetail from './page';
import { useParams, useRouter } from 'next/navigation';
import { WordEntryDetail } from '@/types/api';

// Mocks

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('@/hooks/useEntries', () => ({
  useEntry: jest.fn(),
}));
const useEntryMock = useEntry as jest.MockedFunction<typeof useEntry>;

jest.mock('@/components/favorite-button', () => ({
  __esModule: true,
  default: () => <button aria-label="Favorite">Favorite</button>,
}));

const mockPlay = jest.fn().mockResolvedValue(undefined);
beforeAll(() => {
  window.Audio = jest
    .fn()
    .mockImplementation(() => ({ play: mockPlay })) as unknown as typeof Audio;
});

// Helpers

function makeEntryResult(
  overrides: Partial<ReturnType<typeof useEntry>> = {},
): ReturnType<typeof useEntry> {
  return {
    data: {
      word: 'hello',
      phonetics: [
        {
          text: "/hə'ləʊ/",
          audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/hello-uk.mp3',
          sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=9021983',
          license: {
            name: 'BY 3.0 US',
            url: 'https://creativecommons.org/licenses/by/3.0/us',
          },
        },
      ],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: '"Hello!" or an equivalent greeting.',
              synonyms: [],
              antonyms: [],
            },
          ],
          synonyms: ['greeting'],
          antonyms: [],
        },
      ],
      license: {
        name: 'CC BY-SA 3.0',
        url: 'https://creativecommons.org/licenses/by-sa/3.0',
      },
      sourceUrls: ['https://en.wiktionary.org/wiki/hello'],
    },
    error: undefined,
    isLoading: false,
    mutate: jest.fn(),
    ...overrides,
  };
}

function makeRouterMock(overrides: Partial<ReturnType<typeof useRouter>> = {}) {
  return {
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    ...overrides,
  } satisfies ReturnType<typeof useRouter>;
}

// Setup

beforeEach(() => {
  jest.clearAllMocks();
  useEntryMock.mockReturnValue(makeEntryResult());
  jest.mocked(useParams).mockReturnValue({ word: 'hello' });
  jest.mocked(useRouter).mockReturnValue(makeRouterMock());
});

// Tests

describe('WordDetail', () => {
  describe('header', () => {
    it('renders the back and favorite buttons', () => {
      render(<WordDetail />);

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /favorite/i })).toBeInTheDocument();
    });

    it('navigates back when the back button is clicked', async () => {
      const back = jest.fn();
      jest.mocked(useRouter).mockReturnValue(makeRouterMock({ back }));

      render(<WordDetail />);
      await userEvent.click(screen.getByRole('button', { name: /back/i }));

      expect(back).toHaveBeenCalledTimes(1);
    });
  });

  describe('loading state', () => {
    it('renders the skeleton while loading', () => {
      useEntryMock.mockReturnValue(makeEntryResult({ isLoading: true, data: undefined }));

      render(<WordDetail />);

      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /play pronunciation/i })).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows a fallback message when no entries are returned', () => {
      useEntryMock.mockReturnValue({
        ...makeEntryResult(),
        data: [] as unknown as WordEntryDetail,
      });

      render(<WordDetail />);

      expect(screen.getByText(/no definitions found/i)).toBeInTheDocument();
    });
  });

  describe('word content', () => {
    it('renders the word title', () => {
      render(<WordDetail />);

      expect(screen.getByRole('heading', { name: /hello/i })).toBeInTheDocument();
    });

    it('renders the phonetic text', () => {
      render(<WordDetail />);

      expect(screen.getByText("/hə'ləʊ/")).toBeInTheDocument();
    });

    it('renders the part-of-speech pill', () => {
      render(<WordDetail />);

      const pills = screen.getAllByText('noun');
      expect(pills.length).toBeGreaterThan(0);
      pills.forEach(pill => expect(pill).toBeInTheDocument());
    });

    it('renders the definition text', () => {
      render(<WordDetail />);

      expect(screen.getByText(/"Hello!" or an equivalent greeting\./i)).toBeInTheDocument();
    });

    it('renders synonyms', () => {
      render(<WordDetail />);

      expect(screen.getByText(/synonyms:/i)).toBeInTheDocument();
      const synonymsParagraph = screen.getByText(/synonyms:/i).closest('p');
      expect(synonymsParagraph).toHaveTextContent('greeting');
    });
  });

  describe('audio', () => {
    it('renders the play pronunciation button when audio is available', () => {
      render(<WordDetail />);

      expect(screen.getByRole('button', { name: /play pronunciation/i })).toBeInTheDocument();
    });

    it('plays audio when the pronunciation button is clicked', async () => {
      render(<WordDetail />);

      await userEvent.click(screen.getByRole('button', { name: /play pronunciation/i }));

      expect(window.Audio).toHaveBeenCalledWith(
        'https://api.dictionaryapi.dev/media/pronunciations/en/hello-uk.mp3',
      );
      expect(mockPlay).toHaveBeenCalledTimes(1);
    });
  });
});
