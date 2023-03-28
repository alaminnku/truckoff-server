import puppeteer from "puppeteer";
import Truck from "../models/truck";
import { sendErrorEmail } from "../utils";

export default async function scrapAdtransHino() {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1024, height: 1600 },
    });

    try {
      // Create page
      const page = await browser.newPage();

      // Truck URLs
      let truckUrls: string[] = [];

      // Target urls
      const targets = [
        "https://www.adtranshino.com.au/new-truck/list/#/s/N4IgLgpgTgtiBcIQBoQGMD2A7AJgSzD2wGcEBtAXVUwBsMBXKU+S1MKAQy2Jj2OKLdyVEBjAALaM1YgYMAEbTQMDgGsICJKhgYcEGppQh5HHAHMNiEAF8RAByh40l0ADMoGOPCz0aNNhgIPn7WqACeEBxQCG4eXsH+4IHevjShIKowzLGeQakBeSGorvT60iI4jgBuEAAqYXYQ5ajEkWDZIO65KX4FPWmo8rph9Y3NIMRgHJDjdGjTguMAyhhQkDgAQmGarm1GAJLEADJ8YABqeBAA7gjspagAChwWS3gAXpYAjAAMqADCjCgECwYCeFgQn2sQA=",
        "https://www.adtranshino.com.au/new-truck/list/#/s/N4IgLgpgTgtiBcIQBoQGMD2A7AJgSzD2wGcEBtAXVUwBsMBXKU+S1MKAQy2Jj2OKLdyVEBjAALaM1YgYMAEbTQMDgGsICJKhgYcEGppQh5HHAHMNiEAF8RAByh40l0ADMoGOPCz0aNNhgIPn7WqACeEBxQCG4eXsH+4IHevjShIKowzLGeQakBeSGorvT60iI4jgBuEAAqYXYQ5ajEkWDZIO65KX4FPWmo8rph9Y3NIMRgHJDjdGjTguMAyhhQkDgAQmGarm1GAJLEADJ8YABqeBAA7gjspagAChwWS3gAXpYAjAAMqADCjCgECwYCeFgQACZrEA",
        "https://www.adtranshino.com.au/new-truck/list/#/s/N4IgLgpgTgtiBcIQBoQGMD2A7AJgSzD2wGcEBtAXVUwBsMBXKU+S1MKAQy2Jj2OKLdyVEBjAALaM1YgYMAEbTQMDgGsICJKhgYcEGppQh5HHAHMNiEAF8RAByh40l0ADMoGOPCz0aNNhgIPn7WqACeEBxQCG4eXsH+4IHevjShIKowzLGeQakBeSGorvT60iI4jgBuEAAqYXYQ5ajEkWDZIO65KX4FPWmo8rph9Y3NIMRgHJDjdGjTguMAyhhQkDgAQmGarm1GAJLEADJ8YABqeBAA7gjspagAChwWS3gAXpYAjAAMqADCjCgECwYCeFgQAGZrEA",
      ];

      // Get all truck urls from 3 pages
      for (let i = 0; i < targets.length - 1; i++) {
        try {
          // Go to the page
          await page.goto(targets[i], { timeout: 0 });

          try {
            // Get all urls in the page
            const truckUrlsPerPage = await page.evaluate(() => {
              // Get all url nodes
              const urlNodes = document.querySelectorAll(
                "#VehiclesInventoryList > div > div > div.two-col > div:nth-child(2) > ol > li > div > div.inventory-listing__actions > div.inventory-listing__actions-btns > a:nth-child(2)"
              );

              // Return the full urls
              return Array.from(urlNodes).map(
                (urlNode) =>
                  `https://www.adtranshino.com.au${urlNode.getAttribute(
                    "href"
                  )}`
              );
            });

            // Add urls to truckUrls
            truckUrls = [...truckUrls, ...truckUrlsPerPage];
          } catch (err) {
            // Send email
            // sendErrorEmail("Adtrans Hino");
            console.log(err);
          }
        } catch (err) {
          // Send email
          // sendErrorEmail("Adtrans Hino");
          console.log(err);
        }
      }

      // All trucks
      let trucks: any[] = [];

      // Collect truck details
      for (let i = 0; i < truckUrls.length; i++) {
        try {
          // Go to truck page
          await page.goto(truckUrls[i], { timeout: 0 });

          try {
            // Create truck details
            const truck = await page.evaluate(() => {
              // Get selector text
              const getSelectorText = (selector: string) =>
                document.querySelector(selector)?.textContent?.trim();

              // Name
              const name = getSelectorText(
                "#content > div.invDtPageTitleWrap > h1"
              );

              // Price
              const price = getSelectorText(
                "#inventory__priceSpecsContainer > div.invPrice > div > div.actualPrice > p"
              )
                ?.split("*")[0]
                .slice(1)
                .replace(",", "");

              // Year
              const year = name?.split(" ")[0];

              // Make
              const make = name?.split("  ")[1].split(" ")[0];

              // Body type
              const bodyType = getSelectorText(
                "#inventory__priceSpecsContainer > dl > dd:nth-child(10)"
              );

              // Get image nodes
              const imageNodes = document.querySelectorAll(
                "#invDtLhs > div.gallery-panel > div > div.carousel.carousel-nav.gallery-carousel-featured-nav.jsGalleryCarouselFeaturedNav.flickity-enabled.is-draggable > div > div > div > div"
              );

              // Get all images
              const images = Array.from(imageNodes).map(
                (imageNode) =>
                  `https://www.adtranshino.com.au${imageNode
                    .getAttribute("data-background-image")
                    ?.replace("/small", "/large")}`
              );

              // Return the truck object
              return {
                name,
                price,
                year,
                make,
                images,
                bodyType,
                location: "QLD",
                website: "adtranshino",
              };
            });

            // Add truck to trucks
            trucks = [...trucks, { ...truck, origin: truckUrls[i] }];
          } catch (err) {
            // Send email
            // sendErrorEmail("Adtrans Hino");
            console.log(err);
          }
        } catch (err) {
          // Send email
          // sendErrorEmail("Adtrans Hino");
          console.log(err);
        }
      }

      // Replace the trucks in the db
      try {
        // Delete all previous trucks
        await Truck.deleteMany({ website: "adtranshino" });

        try {
          // Create new trucks
          await Truck.create(trucks);

          // Confirm message
          console.log("Adtrans Hino done");

          // Close the browser
          await browser.close();
        } catch (err) {
          // Close the browser and send email
          await browser.close();
          // sendErrorEmail("Adtrans Hino");
          console.log(err);
        }
      } catch (err) {
        // Close the browser and send email
        await browser.close();
        // sendErrorEmail("Adtrans Hino");
        console.log(err);
      }
    } catch (err) {
      // Close the browser and send email
      await browser.close();
      // sendErrorEmail("Adtrans Hino");
      console.log(err);
    }
  } catch (err) {
    // sendErrorEmail("Adtrans Hino");
    console.log(err);
  }
}
