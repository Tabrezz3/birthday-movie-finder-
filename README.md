# 🎬 Birthday Movie Finder

A beautiful and intuitive React application that discovers movies released on your birthday! Enter your birth date and explore cinema history to see what films premiered on your special day.

## ✨ Features

- **Date Selection**: Interactive date picker to select your birthday
- **Movie Discovery**: Find movies released on any specific date
- **Smart Filtering**: Filter results by genre and language
- **Flexible Sorting**: Sort by popularity, release date, or title
- **Popular Movies**: Discover trending movies with an elegant slider
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark UI with smooth animations
- **Fast Performance**: Optimized API calls with caching

## Screenshots

(Screenshots will be added once the application is deployed)

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Animations**: Framer Motion for smooth transitions
- **Date Picker**: React DatePicker component
- **Icons**: React Icons library
- **Carousel**: React Slick for movie sliders
- **API**: The Movie Database (TMDB) API
- **HTTP Client**: Axios for API requests

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API key (get it from [https://www.themoviedb.org/documentation/api](https://www.themoviedb.org/documentation/api))

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/birthday-movie-finder.git
cd birthday-movie-finder
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up your TMDB API key

Create a `.env` file in the root directory and add your TMDB API key:

```env
REACT_APP_TMDB_API_KEY=your_api_key_here
```

Get your free API key from [TMDB](https://www.themoviedb.org/settings/api)

4. Start the development server

```bash
npm start
# or
yarn start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Deployment

This project can be easily deployed to services like Netlify, Vercel, or GitHub Pages.

### Netlify Deployment

1. Create a production build

```bash
npm run build
# or
yarn build
```

2. Deploy using the Netlify CLI or connect your GitHub repository to Netlify for automatic deployments.

## Environment Variables

In a production environment, it's recommended to use environment variables for the API key. Create a `.env` file in the root directory:

```
REACT_APP_TMDB_API_KEY=your_api_key_here
```

Then update the `api.ts` file:

```javascript
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
```

## License

MIT

## Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [React DatePicker](https://reactdatepicker.com/) for the date selection component
