import axios from "axios";

// TMDB Base URLs
const TMDB_BASE_URL = "https://api.themoviedb.org/3/search";

const searchMedia = async (req, res) => {
    const {
        query,
        includeAdult = false,
        language = "en-US",
        primaryReleaseYear,
        year,
        region,
        searchType = "multi",
        page = 1,
        excludeIncomplete = false,
    } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }
  
    // Map search types to their corresponding TMDB API endpoints
    const apiUrlMap = {
        movie: `${TMDB_BASE_URL}/movie`,
        tv: `${TMDB_BASE_URL}/tv`,
        person: `${TMDB_BASE_URL}/person`,
        multi: `${TMDB_BASE_URL}/multi`,
    };
  
    try {
      // Make the API request to TMDB
      const response = await axios.get(apiUrlMap[searchType], {
            params: {
                api_key: process.env.TMDB_API_KEY,
                query,
                include_adult: includeAdult,
                language,
                primary_release_year: primaryReleaseYear || undefined,
                year: year || undefined,
                region: region || undefined,
                page,
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
        console.error("Error fetching results from TMDB:", error.message);
        res.status(500).json({ error: "Failed to fetch results from TMDB." });
    }
};

export { searchMedia };