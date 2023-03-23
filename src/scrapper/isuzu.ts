import puppeteer from "puppeteer";
import { sendErrorEmail } from "../utils";

export default async function scrapIsuzu() {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1024, height: 1600 },
    });

    try {
      // Create page
      const page = await browser.newPage();

      // All truck urls
      let truckUrls: string[] = [];

      // Get truck urls from all 9 pages
      for (let i = 1; i < 10; i++) {
        // Go to the page
        await page.goto(
          `https://stock.isuzu.com.au/north-east/listing?page=${i}`,
          { timeout: 0 }
        );

        try {
          // Get all urls in the page
          const truckUrlsPerPage = await page.evaluate(() => {
            // Get all url nodes
            const urlNodes = document.querySelectorAll(
              "#car-search > div > div.layout.clearfix > div > div > div > div.car-details > a"
            );

            // Return the full urls
            return Array.from(urlNodes).map(
              (urlNode) => urlNode.getAttribute("href") as string
            );
          });

          // Add urls to truckUrls
          truckUrls = [...truckUrls, ...truckUrlsPerPage];
        } catch (err) {
          sendErrorEmail("Isuzu");
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

              // Get feature text
              const getFeatureText = (identifier: string) =>
                Array.from(
                  document.querySelectorAll(
                    "body > section > div > div.cl-content > div:nth-child(3) > div.d-col-9 > ul > li"
                  )
                )
                  .find(
                    (feature) =>
                      feature.firstElementChild?.textContent === identifier
                  )
                  ?.lastElementChild?.textContent?.trim();

              // Name
              const name = getSelectorText(
                "body > section > div > div.cl-content > div:nth-child(2) > div.d-col-9 > h1"
              );

              // Price
              const price = getSelectorText(
                "body > section > div > div.cl-content > div:nth-child(2) > div.d-col-3 > div > div > div > span.t-large"
              );

              // Year
              const year = getFeatureText("Year Built:");

              // Body type
              const bodyType = getFeatureText("Body Type");

              // Make
              const make = getFeatureText("Make, Model:")?.split(",")[0].trim();

              // Model
              const model = getFeatureText("Make, Model:")
                ?.split(",")[1]
                .trim();

              // GVM
              const gvm = getFeatureText("GVM:");

              // Kilometers
              const kilometers = getFeatureText("Kilometres:");

              // Get image nodes
              const imageNodes = document.querySelectorAll(
                "body > section > div > div.cl-content > div:nth-child(3) > div.d-col-9 > div.car-gallery > div > div.gallery-layout > div > ul > li > a > img"
              );

              // Get all images
              const images = Array.from(imageNodes).map((imageNode) =>
                imageNode.getAttribute("src")
              );

              // Return the truck object
              return {
                name,
                price,
                year,
                make,
                gvm,
                model,
                images,
                bodyType,
                kilometers,
                location: "SA",
                website: "isuzu",
              };
            });

            // Add truck to trucks
            trucks = [...trucks, truck];
          } catch (err) {
            sendErrorEmail("Isuzu");
          }
        } catch (err) {
          sendErrorEmail("Isuzu");
        }
      }

      console.log(trucks);

      // Close the browser
      await browser.close();
    } catch (err) {
      sendErrorEmail("Isuzu");
    }
  } catch (err) {
    sendErrorEmail("Isuzu");
  }
}
