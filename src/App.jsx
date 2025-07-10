
import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet';

import galleriaData from "./data.json";

const serverDirName = "";
// const serverDirName = "/galleria-portfolio";

export function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}



function AppRoutes() {
  const location = useLocation();
  const state = location.state;
  const background = state && state.background;

  return (
    <>
   
      <Routes location={background || location}>
        <Route path="/" element={<Home />} />

        {galleriaData.map((item, index) => (
          <Route
            key={index+100}
            path={item.path}
            element={<SlidePage data={item} />}
          />
        ))}

   
        {galleriaData.map((item, index) => (
          <Route
            key={index + 1000}
            path={item.path + "/view-image"}
            // element={<ViewImage pic={item.artist.images.show} />}
            element={<ViewImage dataPic={item} />}
          />
        ))}
      </Routes>

     
      {background && (
        <Routes>
          {galleriaData.map((item, index) => (
            <Route
              key={index + 2000}
              path={item.path + "/view-image"}
              element={
                <div className="modal-overlay">
                  <ViewImage dataPic={item} />
                </div>
              }
            />
          ))}
        </Routes>
      )}
    </>
  );
}


function Header({ slideShowOrder }) {
  const linkPath = slideShowOrder === "STOP SLIDESHOW" ? "/" : "/starry-night";

  return (
    <header className="header">
			<div className="header-content-wrapper">

				<Link to="/" className="slideshow-link">
        <img
          className="logo"
          src={serverDirName + "./images/logo/galleria.svg"}
					alt="Galleria Logo"
					/>
				</Link>
				
        <Link to={linkPath} className="slideshow-link">
          {slideShowOrder}
        </Link>

        <hr className="upper-hr" />
      </div>
    </header>
  );
}

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header slideShowOrder="START SLIDESHOW" />
			<main className="galleria-main">
        <nav className="galleria-nav">
          {galleriaData.map((item, index) => (
						<Link
						key={index + 5000}
              className="galleria-picture-link"
              to={item.path}
              style={{ textDecoration: "none" }}
            >
              <GalleriaNavLink item={item} />
            </Link>
          ))}
        </nav>
      </main>
    
    </>
  );
}

function GalleriaNavLink({ item }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <>
      <picture
        
      >
        <source
          media="(max-width: 480px)"
          srcSet={serverDirName + item.artist.images.mobNav}
          type="image/webp"
        />
        <source
          media="(max-width: 1024px)"
          srcSet={serverDirName + item.artist.images.tabNav}
          type="image/webp"
        />
        <img
          src={serverDirName + item.artist.images.pcNav}
          alt={item.alt}
          loading="lazy"
          onLoad={() => {
         
            setTimeout(() => setImgLoaded(true), 50);
          }}
          className={`galleria-nav-link-image ${item.wrapperClass}`}
        />
      </picture>

      {imgLoaded && (
        <div className={`shadow ${item.wrapperClass}`}>
     
          <div className="galleria-nav-link-image-gradient">
            <h2 className="galleria-nav-link-painting-name"><pre style={{ margin: 0 }}>{item.name}</pre></h2>
            <p className="galleria-nav-link-painting-artist-name">
              {item.artist.name}
            </p>
          </div>
        </div>
     )} 
    </>
  );
}


function SlidePage({ data }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

	return (
		<>
			 <Helmet>
				<title>{`Galleria. ${data.name}, ${data.year}`}</title>
        <meta name="description" content={data.alt} />
				<meta property="og:title" content={`Galleria. ${data.name}, ${ data.year}`} />
        <meta property="og:description" content={data.alt} />
			</Helmet>
		<>
			
      <Header slideShowOrder="STOP SLIDESHOW" />

      <main className="slideshow-main">
        <section className="slide-section">
          <SlidePic data={data} />

          <Link to={data.path + "/view-image"} state={{ background: location }}>
            <div className="slide-painting-view-button">
              <img
                className="slide-painting-view-button-arrows"
                src={serverDirName + "./images/special_pics/arrows-view.svg"}
                alt="Slide painting view button arrows"
              />
              <p className="slide-painting-view-button-caption">VIEW IMAGE</p>
             
            </div>
          </Link>
        </section>

        <section className="painting-artist-info-section">
          <div className="painting-artist-info-section-content-wrapper">
            <div className="painting-artist-captions-wrapper">
              <h1 className="painting-name">{data.name}</h1>
              <h2 className="artist-name">{data.artist.name}</h2>
            </div>
            <img
								className="artist-portrait-img"
								src={serverDirName + data.artist.images.artistPortrait}
								alt={`Portrait of ${data.name}`}
            />
          </div>
        </section>

        <section className="painting-description-section">
          <p className="painting-date">{data.year}</p>
          <p className="painting-description-p">{data.description}</p>

          <a
            href={data.source}
            target="_blank"
            rel="noopener noreferrer"
            className="painting-ref-to-wiki"
          >
            GO TO SOURCE
          </a>
        </section>
      </main>

      <Footer data={data} />
			</>
		 </>
  );
}

function SlidePic({ data }) {
  return (
    <picture>
      <source
        media="(max-width: 480px)"
        srcSet={serverDirName + data.artist.images.slideSmall}
      />
      <source
        media="(min-width: 481px)"
        srcSet={serverDirName + data.artist.images.slide}
      />
      <img
				className="slide-painting"
				src={serverDirName + data.artist.images.slide}
				alt={ data.alt}
      />
    </picture>
  );
}

function Footer({ data }) {
  const currentIndex = galleriaData.findIndex(
    (page) => page.path === data.path
  );
  const baseFill = `${(currentIndex + 1) * 6.6667}%`;
  const previousPage = galleriaData[currentIndex - 1] || null;
  const nextPage = galleriaData[currentIndex + 1] || null;

  return (
    <footer className="footer">
      <hr className="lower-hr" style={{ width: baseFill }} />
      <div className="footer-content-wrapper">
        <div className="footer-painting-info">
          <h2 className="footer-painting-info-paining-name">{data.name}</h2>
          <p className="footer-painting-info-artist-name">{data.artist.name}</p>
        </div>
        <div className="footer-slideshowControl">
          {previousPage ? (
            <Link
              to={previousPage.path}
              style={{ opacity: "1", cursor: "pointer" }}
            >
              <img
                className="leftArrow"
                src={serverDirName + "./images/special_pics/arrow-left-big.svg"}
                alt="left navigation arrow"
              />
            </Link>
          ) : (
            <span style={{ opacity: "0.25", pointerEvents: "none" }}>
              <img
                className="leftArrow"
                src={serverDirName + "./images/special_pics/arrow-left-big.svg"}
                alt="left navigation arrow"
              />
            </span>
          )}

          {nextPage ? (
            <Link
              to={nextPage.path}
              style={{ opacity: "1", cursor: "pointer" }}
            >
              <img
                className="rightArrow"
                src={serverDirName + "./images/special_pics/arrow-right-big.svg"}
                alt="right navigation arrow"
              />
            </Link>
          ) : (
            <span style={{ opacity: "0.25", pointerEvents: "none" }}>
              <img
                className="rightArrow"
                src={serverDirName + "./images/special_pics/arrow-right-big.svg"}
                alt="right navigation arrow"
              />
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

function ViewImage({ dataPic }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div className="view-pic">
  
			<img className='img-lage' src={serverDirName + dataPic.artist.images.show} alt={dataPic.alt} />
		
			
    </div>
  );
}
