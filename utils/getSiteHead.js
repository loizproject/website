const type = "website";
const url = process.env.APP_URL;
const title = "Loiz Tours & Travels Ltd - Your Gateway to Exhilarating & Seamless Travel Experiences!";
const description = "Whether you're planning your next adventure or seeking assistance with visa services, flights, or tours, trust Loiz Tours & Travels to make your travel experience unforgettable. Join us on our journey as we redefine the standards of excellence in the travel industry. Discover the world with Loiz Tours & Travels – Where Every Journey Begins with Excellence!";
const mainImage = "https://res.cloudinary.com/loiztours/image/upload/site-media/img/atikh-bana.png";
const twitterSite = "@Loiztravels";
const twitterCard = "summary_large_image"
export default (meta) => {
  return {
    title: (meta && meta.title) || title,
    description: (meta && meta.description) || description,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: "description",
        name: "description",
        content: (meta && meta.description) || description,
      },
      {
        hid: "og:type",
        property: "og:type",
        content: (meta && meta.type) || type,
      },
      {
        hid: "og:url",
        property: "og:url",
        content: (meta && meta.url) || url,
      },
      {
        hid: "og:title",
        property: "og:title",
        content: (meta && meta.title) || title,
      },
      {
        hid: "og:description",
        property: "og:description",
        content: (meta && meta.description) || description,
      },
      {
        hid: "og:image",
        property: "og:image",
        content: (meta && meta.mainImage) || mainImage,
      },
      {
        hid: "twitter:url",
        name: "twitter:url",
        content: (meta && meta.url) || url,
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: (meta && meta.title) || title,
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: (meta && meta.description) || description,
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: (meta && meta.mainImage) || mainImage,
      },
      {
        hid: "twitter:site",
        name: "twitter:site",
        content: (meta && meta.twitterSite) || twitterSite,
      },
      {
        hid: "twitter:card",
        name: "twitter:card",
        content: (meta && meta.twitterCard) || twitterCard,
      }
    ]
  }
};