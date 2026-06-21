import { useEntry } from '@/hooks/useEntries';
import { render, screen } from '@testing-library/react';
import WordDetail from './page';
import { useParams } from 'next/navigation';

// Mocks

jest.mock('next/navigation', () => ({
  useRouter: () => ({ back: jest.fn() }),
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

// Setup

beforeEach(() => {
  jest.clearAllMocks();
  useEntryMock.mockReturnValue(makeEntryResult());
  jest.mocked(useParams).mockReturnValue({ slug: 'hello' });
});

// Tests

describe('Word Detail', () => {
  it('renders the word header', () => {
    render(<WordDetail />);

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /favorite/i })).toBeInTheDocument();
  });

  it('renders the word details', () => {
    render(<WordDetail />);

    expect(screen.getByTestId('audio-phonetics')).toBeInTheDocument();
    expect(screen.getByText('noun')).toBeInTheDocument();
  });
});
