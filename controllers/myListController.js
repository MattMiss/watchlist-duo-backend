import { db } from "../config/firebase.js";

const getMyList = async (req, res) => {
    const idToken = req.headers.authorization?.split("Bearer ")[1]; // Extract token
  
    if (!idToken) {
        return res.status(401).json({ error: "Unauthorized: Missing token" });
    }
  
    try {
        const userId = req.user.uid;
  
        // Fetch movies and TV shows for the user
        const fetchMovies = async () => {
            const moviesRef = db.collection("users").doc(userId).collection("movies");
            const moviesSnapshot = await moviesRef.get();
            return moviesSnapshot.docs.map((doc) => ({
            id: Number(doc.id),
            title: doc.data().name || "Unknown",
            release_date: doc.data().year ? `${doc.data().year}-01-01` : undefined,
            vote_average: doc.data().rating || 0,
            poster_path: doc.data().poster_path || null,
            media_type: "movie",
            owner: "self",
            }));
        };
  
        const fetchTVShows = async () => {
            const tvRef = db.collection("users").doc(userId).collection("tv");
            const tvSnapshot = await tvRef.get();
            return tvSnapshot.docs.map((doc) => ({
            id: Number(doc.id),
            name: doc.data().name || "Unknown",
            first_air_date: doc.data().year ? `${doc.data().year}-01-01` : undefined,
            vote_average: doc.data().rating || 0,
            poster_path: doc.data().poster_path || null,
            media_type: "tv",
            owner: "self",
            }));
        };
  
        const [movies, tvShows] = await Promise.all([fetchMovies(), fetchTVShows()]);
        res.json([...movies, ...tvShows]);
    } catch (error) {
        console.error("Error verifying token or fetching My List:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const addToMyList = async (req, res) => {
    try {
        const userId = req.user.uid; // Extracted from the verified token middleware
        const { media, type } = req.body;

        if (!media || !type || (type !== "movie" && type !== "tv")) {
            return res.status(400).json({ error: "Invalid request payload." });
        }

        const collectionName = type === "movie" ? "movies" : "tv";
        const mediaRef = db.collection("users").doc(userId).collection(collectionName).doc(media.id.toString());

        // Check if the media already exists
        const mediaSnap = await mediaRef.get();
        if (mediaSnap.exists) {
            return res.status(409).json({ error: `${type === "movie" ? "Movie" : "TV Show"} is already on your list!` });
        }

        // Save the media to Firestore
        const name = type === "movie" ? media.title : media.name;
        const year = type === "movie"
            ? media.release_date?.slice(0, 4)
            : media.first_air_date?.slice(0, 4);

        await mediaRef.set({
            id: media.id,
            type,
            name: name || "Unknown",
            year: year || "Unknown",
            rating: media.vote_average,
            poster_path: media.poster_path,
            updatedDate: new Date().toISOString().split("T")[0], // Save only the date
        });

        res.status(200).json({ message: `${type === "movie" ? "Movie" : "TV Show"} added to your list!` });
    } catch (error) {
        console.error("Error adding media to list:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteFromMyList = async (req, res) => {
    try {
        const userId = req.user.uid; // Extracted from the verified token middleware
        const { mediaId, type } = req.body;
    
        if (!mediaId || !type || (type !== "movie" && type !== "tv")) {
            return res.status(400).json({ error: "Invalid request payload." });
        }
    
        const collectionName = type === "movie" ? "movies" : "tv";
        const mediaRef = db.collection("users").doc(userId).collection(collectionName).doc(mediaId);
    
        // Check if the media exists
        const mediaSnap = await mediaRef.get();
        if (!mediaSnap.exists) {
            return res.status(404).json({ error: `${type === "movie" ? "Movie" : "TV Show"} not found in list!` });
        }
  
        // Delete the media
        await mediaRef.delete();
    
        res.status(200).json({ message: `${type === "movie" ? "Movie" : "TV Show"} removed successfully!` });
    } catch (error) {
        console.error("Error removing media from list:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
  

  

export { getMyList, addToMyList, deleteFromMyList };
