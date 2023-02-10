import React from "react";
import "./Guide.css";

const Guide = () => {
  return (
    <div
      style={{
        backgroundImage: `url(SOCKS2.svg)`,
        backgroundRepeat: "no-repeat",
        backgroundColor: "#98C1FF",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: 18,
          maxWidth: 1086,
          margin: "auto",
          paddingRight: 20,
          paddingLeft: 20,
        }}
      >
        <h2 style={{ fontSize: "80px", fontWeight: 550, fontFamily: "just another hand" }}>The Ultimate Guide To</h2>
        <img
          style={{ marginTop: -50, marginBottom: "20px" }}
          src="./assets/styleYourSocks.svg"
          alt="style your socks"
        />
        {/* <div style={{ textAlign: "left", marginLeft: 50, marginBottom: 50 }}>
        <ul>
          <li>
            Go to{" "}
            <a target="_blank" href="https://chainid.link/?network=optimism" rel="noreferrer">
              https://chainid.link/?network=optimism
            </a>
          </li>
          <li>
            Click on <strong>connect</strong> to add the <strong>Optimistic Ethereum</strong> network in{" "}
            <strong>MetaMask</strong>.
          </li>
        </ul>
      </div> */}
        <p style={{ fontSize: 13, fontWeight: 600 }}>
          Socks are not the most important part of our daily wardrobe, but quite often we simply need these. We had made
          our research and found out that some people have a hardtime finding the right socks for their everyday looks.
          It's for such people that we decided to share a small guide, with limited collection of "That Socks" SVG NFTs.
        </p>
        <h2 style={{ marginTop: "20px", fontFamily: "just another hand", fontSize: "40px", fontWeight: 550 }}>
          Pick The Right Length
        </h2>
        <p style={{ fontSize: 13, fontWeight: 600 }}>
          The length of the sock may depend on the season, your outfit, the shoes you wear. For example Dr. Marten is
          best worn in socks with extra fleece on the head or the entire sole, so they rub less. With hard shoes it is
          better to wear tight socks in the winter - high socks, will be much warmer. If the heel is often rubbed, then
          you can order additional leader patches that will also protect the back of the shoe from the inside.
        </p>
        <img style={{ marginTop: 10, width: "80%" }} src="./assets/guide1.svg" alt="guide one" />
        <h2 style={{ marginTop: "20px", fontFamily: "just another hand", fontSize: "40px", fontWeight: 550 }}>
          Examples
        </h2>
        <p style={{ fontSize: 13, fontWeight: 600 }}>
          Don't Know how to match the socks and shoes? Here are some ideas for you
        </p>
        <img style={{ marginTop: 10, width: "80%" }} src="./assets/guide2.svg" alt="guide two" />

        <h2 style={{ marginTop: "20px", fontFamily: "just another hand", fontSize: "40px", fontWeight: 550 }}>
          Classy black&white
        </h2>
        <p style={{ fontSize: 13, fontWeight: 600 }}>
          It is very useful to have several pairs of cotton socks in black and white, because they fit well with almost
          everything. If you are not a fan of white socks, take black ones. Blue and brown socks can be combined with
          trousers of the same color, pretty much applies to every plain colour.
        </p>
        <img style={{ marginTop: 10, width: "60%" }} src="./assets/guide3.svg" alt="guide three" />
        <h2 style={{ marginTop: "20px", fontFamily: "just another hand", fontSize: "40px", fontWeight: 550 }}>
          Use Patterns
        </h2>
        <p style={{ fontSize: 13, fontWeight: 600 }}>
          It is very useful to have several pairs of cotton socks in black and white, because they fir well with almost
          everything. If you are not a fan of white socks, take cotton black ones (not dark blue! Black, dark light
          grey, even beige, but not blue, not brown either"). Avoid mixing patterned socks with patterned pants.
        </p>
        <img style={{ marginTop: 10, width: "80%" }} src="./assets/guide4.svg" alt="guide four" />
        <h2 style={{ marginTop: "20px", fontFamily: "just another hand", fontSize: "40px", fontWeight: 550 }}>
          Warm or Cold
        </h2>
        <p style={{ fontSize: 13, fontWeight: 600 }}>
          Doesn’t matter what, always pick a nice breathable fabrics, like cotton, wool, viscose, cashmere, silk. You
          can also use socks with mixed materials. It will help you to avoid uncomfortable situations with stinky socks.
          For summer use more breathable and light socks, for winter, warm and dense, You don't want your feet to
          freeze, it's easy to get sick like this.
        </p>
        <img style={{ marginTop: 10, width: "60%" }} src="./assets/guide5.svg" alt="guide five" />
        <h2 style={{ marginTop: "20px", fontFamily: "just another hand", fontSize: "40px", fontWeight: 550 }}>
          Tidy and Clean
        </h2>
        <p style={{ fontSize: 13, fontWeight: 600 }}>
          Keep your socks clean and tidy, you never know where you'll have to take off your shoes. Old socks should go
          either to the trash or to recycling, but definitely it doesn’t have a place in your drawer.
        </p>
        <img style={{ marginTop: 10, width: "60%" }} src="./assets/guide6.svg" alt="guide six" />
        <h2 style={{ marginTop: "20px", fontFamily: "just another hand", fontSize: "40px", fontWeight: 550 }}>
          White Flag
        </h2>
        <p style={{ fontSize: 13, fontWeight: 600 }}>
          Don’t mix up! I advise you not to mix brands of socks and shoes. Don't wear Adidas with Nike and New Balance
          with Reebok, it's all "White Flag". Most sports brands have in stock not only shoes, but also socks in the
          amount of 2-5 pairs at once. If you don't want to wear branded socks, you can again use patterned socks, or
          the black/white version.
        </p>
        <img style={{ marginTop: 10, width: "60%" }} src="./assets/guide7.svg" alt="guide seven" />
        <h2 style={{ marginTop: "20px", fontFamily: "just another hand", fontSize: "40px", fontWeight: 550 }}>
          Alternative
        </h2>
        <img style={{ marginTop: 10 }} src="./assets/guide8.svg" alt="guide eight" />
      </div>
    </div>
  );
};

export default Guide;
