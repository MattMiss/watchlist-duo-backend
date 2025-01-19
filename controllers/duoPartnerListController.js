import { db } from "../config/firebase.js";

const getDuoPartnerList = async (req, res) => {
    const idToken = req.headers.authorization?.split("Bearer ")[1]; // Extract token
  
    if (!idToken) {
        return res.status(401).json({ error: "Unauthorized: Missing token" });
    }
  
    try {
        const userId = req.user.uid;

        // Fetch the user's Firestore document to get partnerUid
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "User document not found" });
        }

        const partnerUid = userDoc.data().partnerUid;
        if (!partnerUid) {
            return res.status(400).json({ error: "No partner linked to this user" });
        }
  
        // Fetch movies and TV shows for the user
        const fetchPartnerMovies = async () => {
            const moviesRef = db.collection("users").doc(partnerUid).collection("movies").orderBy("name");
            const moviesSnapshot = await moviesRef.get();
            return moviesSnapshot.docs.map((doc) => ({
                id: Number(doc.id),
                title: doc.data().name || "Unknown",
                release_date: doc.data().year ? `${doc.data().year}-01-01` : undefined,
                vote_average: doc.data().rating || 0,
                poster_path: doc.data().poster_path || null,
                media_type: "movie",
                owner: "partner",
                sortName: doc.data().name?.toLowerCase() || "zzz", // Uniform sorting key
            }));
        };
  
        const fetchPartnerTVShows = async () => {
            const tvRef = db.collection("users").doc(partnerUid).collection("tv").orderBy("name");
            const tvSnapshot = await tvRef.get();
            return tvSnapshot.docs.map((doc) => ({
                id: Number(doc.id),
                name: doc.data().name || "Unknown",
                first_air_date: doc.data().year ? `${doc.data().year}-01-01` : undefined,
                vote_average: doc.data().rating || 0,
                poster_path: doc.data().poster_path || null,
                media_type: "tv",
                owner: "partner",
                sortName: doc.data().name?.toLowerCase() || "zzz", // Uniform sorting key
            }));
        };
  
        // Fetch both lists concurrently
        const [partnerMovies, partnerTvShows] = await Promise.all([fetchPartnerMovies(), fetchPartnerTVShows()]);

        // Combine both arrays
        const combinedList = [...partnerMovies, ...partnerTvShows];
    
        // Sort the merged array based on `sortName`
        combinedList.sort((a, b) => a.sortName.localeCompare(b.sortName));
    
        // Remove the temporary sort key before sending response
        const finalList = combinedList.map(({ sortName, ...item }) => item);
    
        res.json(finalList);
    } catch (error) {
        console.error("Error verifying token or fetching Duo Partner List:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { getDuoPartnerList };