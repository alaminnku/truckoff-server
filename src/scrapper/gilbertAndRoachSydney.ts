import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";
import { sendErrorEmail } from "../utils";

export default async function scrapGilbertAndRoachSydney() {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1024, height: 1600 },
    });

    try {
      // Create page
      const page = await browser.newPage();

      try {
        // Go to the page
        await page.goto(
          "https://www.gilbertandroachsydney.com.au/inventory/trucks",
          { timeout: 0 }
        );

        try {
          // Scroll to the bottom of the page
          // @ts-ignore
          await scrollPageToBottom(page);

          try {
            // Get all urls in the page
            const truckUrls = await page.evaluate(() => {
              // Get all url nodes
              const urlNodes = document.querySelectorAll(
                "#inventory_cards > div > div > div > a"
              );

              // #inventory_cards > div > div > a

              // Return the full urls
              return Array.from(urlNodes).map(
                (urlNode) =>
                  `https://www.gilbertandroachsydney.com.au${urlNode.getAttribute(
                    "href"
                  )}`
              );
            });

            // All trucks
            let trucks: any[] = [];

            // Get truck details
            for (let i = 0; i < truckUrls.length; i++) {
              try {
                // Go to each page
                await page.goto(truckUrls[i], { timeout: 0 });

                try {
                  // Get truck details
                  const truck = await page.evaluate(() => {
                    // Get selector text
                    const getSelectorText = (selector: string) =>
                      document.querySelector(selector)?.textContent?.trim();

                    // Name
                    const name = getSelectorText(
                      "body > div.content > header > div > div > div > div > h1"
                    );

                    // Price
                    const price = getSelectorText(
                      "#vehicleEnquiry > div > div.form__header > div > h2"
                    );

                    // Year
                    const year = name?.split(" ")[0];

                    // Make
                    const make = name?.split(" ")[1];

                    // GVM
                    const gvm = getSelectorText(
                      "#featuresScrollTo > div > div > div > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2)"
                    )?.replace("kg", "KG");

                    // Image nodes
                    const imageNodes = document.querySelectorAll(
                      "body > div.content > section:nth-child(1) > div > div.swiper-wrapper.gallery--vehicle > div > picture > img"
                    );

                    // Images
                    const images = Array.from(imageNodes)
                      .map((imageNode) => imageNode.getAttribute("data-src"))
                      .filter((image) => image !== null);

                    // Return the truck object
                    return {
                      name,
                      price,
                      year,
                      make,
                      gvm,
                      images,
                      location: "NSW",
                      website: "gilbertandroachsydney",
                    };
                  });

                  // Add truck to trucks
                  trucks = [...trucks, truck];
                } catch (err) {
                  sendErrorEmail("Gilbert and Roach Sydney");
                }
              } catch (err) {
                sendErrorEmail("Gilbert and Roach Sydney");
              }
            }

            console.log(trucks);

            // Close the browser
            await browser.close();
          } catch (err) {
            sendErrorEmail("Gilbert and Roach Sydney");
          }
        } catch (err) {
          sendErrorEmail("Gilbert and Roach Sydney");
        }
      } catch (err) {
        sendErrorEmail("Gilbert and Roach Sydney");
      }
    } catch (err) {
      sendErrorEmail("Gilbert and Roach Sydney");
    }
  } catch (err) {
    sendErrorEmail("Gilbert and Roach Sydney");
  }
}
