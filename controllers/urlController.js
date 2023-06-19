import shortid from 'shortid';
import URL from '../models/shortURL.js';

export const generateShortLink = async (longUrl) => {
    try {
        const url = longUrl;
        const shortId = shortid.generate();

        const newUrl = new URL({
            shortId,
            redirectURl: url,
            visitHistory: [],
        });
        await newUrl.save();

        return shortId;
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred on the server");
    }
};


export const shortURL = async (req, res) => {
    try {
        const shortId = req.params.shortid
        const entry = await URL.findOneAndUpdate({
            shortId
        }, {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        })
        res.redirect(entry.redirectURl)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "An error occurred on the server" })
    }
};