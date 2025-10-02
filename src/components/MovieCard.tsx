import React from 'react';
import { MovieCardProps } from '../types';
import { getImageUrl, getTMDBMovieUrl } from '../services/api';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const MovieCard: React.FC<MovieCardProps> = ({ movie, genres }) => {
  
  const handleMovieClick = () => {
    window.open(getTMDBMovieUrl(movie.id), '_blank', 'noopener,noreferrer');
  };
  
  return (
    <motion.div 
      className={`h-full bg-[#181818] dark:bg-[#181818] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col border border-[#212121]`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={handleMovieClick}
    >
      <div className="relative pb-[140%]">
        {movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-[#212121] dark:bg-[#212121] flex items-center justify-center">
            <span className="text-[#999999] dark:text-[#999999] text-[10px] sm:text-xs font-['Against']">No Poster</span>
          </div>
        )}
        <div className="absolute top-1 right-1 bg-[#121212] bg-opacity-80 text-[#00BCD4] px-1.5 py-0.5 rounded text-[10px] font-bold border border-[#00BCD4]">
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
      
      <div className="p-2 sm:p-3 flex-grow flex flex-col">
        <h3 className="text-xs sm:text-sm font-['Against'] text-[#FFFFFF] dark:text-[#FFFFFF] mb-0.5 sm:mb-1 line-clamp-1 sm:line-clamp-2 tracking-wide">
          {movie.title}
        </h3>
        <p className="text-[10px] sm:text-xs text-[#AAAAAA] dark:text-[#AAAAAA] mb-1 sm:mb-2">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
        </p>
        
        <div className="mt-auto flex flex-wrap gap-1">
          {movie.genre_ids.slice(0, 1).map(genreId => {
            const genre = genres.find(g => g.id === genreId);
            return genre ? (
              <span 
                key={genreId} 
                className="px-1.5 py-0.5 text-[8px] sm:text-[10px] bg-[#212121] dark:bg-[#212121] text-[#00BCD4] dark:text-[#00BCD4] rounded-full truncate max-w-full border border-[#00BCD4] font-['Inter']"
              >
                {genre.name}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard; 