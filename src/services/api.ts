import { MoviesResponse, GenresResponse, LanguagesResponse } from '../types';

// Use serverless function for production, direct API for development
const isDevelopment = process.env.NODE_ENV === 'development';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'c16488af7ab2efaf5b5ce51f6ff22ee1';
const BASE_URL = isDevelopment ? 'https://api.themoviedb.org/3' : '/api/tmdb';

// Test API connection
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing API connection...');
    console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 8)}...` : 'Not set');
    console.log('Base URL:', BASE_URL);

    let response;
    if (isDevelopment) {
      response = await fetch(`${BASE_URL}/configuration?api_key=${API_KEY}`);
    } else {
      response = await fetch(`${BASE_URL}?endpoint=/configuration`);
    }
    
    const data = await response.json();

    if (response.ok) {
      console.log('API connection successful!', data);
      return true;
    } else {
      console.error('API connection failed:', data);
      return false;
    }
  } catch (error) {
    console.error('API test error:', error);
    return false;
  }
};

async function tmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  try {
    let url: string;
    
    if (isDevelopment) {
      // Direct TMDB API call for development
      const tmdbUrl = new URL(`https://api.themoviedb.org/3${endpoint}`);
      tmdbUrl.searchParams.set('api_key', API_KEY);
      
      if (!endpoint.includes('language=')) {
        tmdbUrl.searchParams.set('language', 'en-US');
      }

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          tmdbUrl.searchParams.set(key, value);
        });
      }
      
      url = tmdbUrl.toString();
    } else {
      // Use serverless function for production
      const serverlessUrl = new URL(`${window.location.origin}/api/tmdb`);
      serverlessUrl.searchParams.set('endpoint', endpoint);
      
      if (!endpoint.includes('language=')) {
        serverlessUrl.searchParams.set('language', 'en-US');
      }

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          serverlessUrl.searchParams.set(key, value);
        });
      }
      
      url = serverlessUrl.toString();
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export const getMoviesByDate = async (month: number, day: number, year?: number): Promise<MoviesResponse> => {
  try {
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');

    // For birthday movie finder, we want movies released on the same month/day across all years
    const params: Record<string, string> = {
      'sort_by': 'popularity.desc',
      'page': '1'
    };

    // If year is provided, search for that specific date
    if (year) {
      params['primary_release_date.gte'] = `${year}-${monthStr}-${dayStr}`;
      params['primary_release_date.lte'] = `${year}-${monthStr}-${dayStr}`;
    } else {
      // Search across all years for the same month/day
      params['primary_release_date.gte'] = `1900-${monthStr}-${dayStr}`;
      params['primary_release_date.lte'] = `2030-${monthStr}-${dayStr}`;
    }

    return await tmdbFetch<MoviesResponse>('/discover/movie', params);
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const getGenres = async (): Promise<GenresResponse> => {
  try {
    return await tmdbFetch<GenresResponse>('/genre/movie/list');
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder.jpg';
};

export const getTMDBMovieUrl = (movieId: number): string => {
  return `https://www.themoviedb.org/movie/${movieId}`;
};

export const getLanguages = async (): Promise<LanguagesResponse> => {
  try {
    const data = await tmdbFetch<LanguagesResponse>('/configuration/languages');
    return data.filter(lang => lang.english_name);
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
};

export const getPopularMovies = async (): Promise<MoviesResponse> => {
  try {
    return await tmdbFetch<MoviesResponse>('/movie/popular', {
      page: '1'
    });
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};