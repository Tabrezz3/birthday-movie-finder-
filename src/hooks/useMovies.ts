import { useState, useEffect } from 'react';
import { getMoviesByDate } from '../services/api';
import { Movie, Genre, Language } from '../types';

// Define a mapping from genre IDs to names (could be fetched initially or hardcoded if static)
// This is a simplified example, ideally fetch this once and store it
const genreMap: { [id: number]: string } = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

// Similarly, a map for language codes might be useful or fetched
// This is highly simplified
const languageMap: { [iso: string]: string } = {
  'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'ja': 'Japanese', 'it': 'Italian', 'ko': 'Korean', 'zh': 'Chinese', 'ru': 'Russian', 'hi': 'Hindi'
  // Add more as needed
};

export const useMovies = (selectedDate: Date | null) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allFetchedMovies, setAllFetchedMovies] = useState<Movie[]>([]); // Store all movies before filtering
  const [genres, setGenres] = useState<Genre[]>([]); // Will hold genres derived from results
  const [languages, setLanguages] = useState<Language[]>([]); // Will hold languages derived from results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('popularity');
  // const [useExactYear, setUseExactYear] = useState<boolean>(true); // Assuming this state is not used based on Filters.tsx shown previously

  // Fetch movies when date changes
  useEffect(() => {
    const fetchMovies = async () => {
      if (!selectedDate) {
        setMovies([]);
        setAllFetchedMovies([]);
        setGenres([]);
        setLanguages([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      // Reset filters when date changes
      setSelectedGenre(null);
      setSelectedLanguage(null);
      // Reset derived lists
      setGenres([]);
      setLanguages([]);
      
      try {
        const month = selectedDate.getMonth() + 1;
        const day = selectedDate.getDate();
        const year = selectedDate.getFullYear();
        
        const data = await getMoviesByDate(month, day, year);
        const fetchedMovies = data.results || [];
        setAllFetchedMovies(fetchedMovies); // Store all results
        setMovies(fetchedMovies); // Initially display all

        // Derive Genres and Languages from fetched movies
        const uniqueGenreIds = new Set<number>();
        const uniqueLanguageCodes = new Set<string>();
        fetchedMovies.forEach(movie => {
          movie.genre_ids.forEach(id => uniqueGenreIds.add(id));
          if (movie.original_language) {
            uniqueLanguageCodes.add(movie.original_language);
          }
        });

        const derivedGenres: Genre[] = Array.from(uniqueGenreIds)
          .map(id => ({ id, name: genreMap[id] || `Unknown (${id})` }))
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort genres alphabetically

        const derivedLanguages: Language[] = Array.from(uniqueLanguageCodes)
          .map(code => ({ iso_639_1: code, english_name: languageMap[code] || `Unknown (${code})`, name: '' })) // Populate based on map
          .sort((a, b) => a.english_name.localeCompare(b.english_name)); // Sort languages alphabetically

        setGenres(derivedGenres);
        setLanguages(derivedLanguages);

      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        setMovies([]);
        setAllFetchedMovies([]);
        setGenres([]);
        setLanguages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedDate]);

  // Filter and Sort Movies - Now operates on allFetchedMovies
  useEffect(() => {
    let processedMovies = [...allFetchedMovies];

    // Filter
    processedMovies = processedMovies
      .filter(movie => selectedGenre ? movie.genre_ids.includes(selectedGenre) : true)
      .filter(movie => selectedLanguage ? movie.original_language === selectedLanguage : true);

    // Sort
    processedMovies.sort((a, b) => {
      if (sortBy === 'release_date') {
        // Assuming release_date format is consistent (e.g., YYYY-MM-DD)
        return (b.release_date || '').localeCompare(a.release_date || '');
      } else if (sortBy === 'popularity') {
        return (b.popularity || 0) - (a.popularity || 0); // Use popularity instead of vote_average
      } else if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    setMovies(processedMovies);
  }, [allFetchedMovies, selectedGenre, selectedLanguage, sortBy]);

  return {
    movies, // This is now the filtered and sorted list
    genres, // Derived from results
    languages, // Derived from results
    loading,
    error,
    selectedGenre,
    setSelectedGenre,
    selectedLanguage,
    setSelectedLanguage,
    sortBy,
    setSortBy,
    // useExactYear, // Assuming not used
    // setUseExactYear // Assuming not used
  };
};