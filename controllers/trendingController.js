import axios from "axios";

// TMDB Base URLs
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const getTrendingMedia = async (req, res) => {
    const {
        language = "en-US",
        page = 1,
        excludeIncomplete = false,
        mediaType = "movie",
        timeWindow = "week",
    } = req.query;

    const pageNumber = parseInt(page, 10);
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 1000) {
        return res.status(400).json({ error: "Invalid page parameter. Must be an integer between 1 and 1000." });
    }

    // Map search types to their corresponding TMDB API endpoints
    const apiUrlMap = {
        movie: `${TMDB_BASE_URL}/trending/movie/${timeWindow}`,
        tv: `${TMDB_BASE_URL}/trending/tv/${timeWindow}`
    };
  
    try {
        // Make the API request to TMDB
        const response = await axios.get(apiUrlMap[mediaType], {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language,
                    page: pageNumber
                },
        });
  
        // Optionally filter incomplete results
        let results = response.data.results;
        if (excludeIncomplete) {
            results = results.filter((result) => {
                if ("poster_path" in result) {
                    return result.poster_path && result.vote_average !== undefined && result.vote_average > 0;
                }
                return true;
            });
        }
  
        res.json({ ...response.data, results });
    } catch (error) {
        console.error("Error fetching trending TV results from TMDB:", error.message);
        res.status(500).json({ error: "Failed to fetch trending TV results from TMDB." });
    }
};

export { getTrendingMedia };