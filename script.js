const API_KEY = 'vK6x04nqAqkPILA53dkQBzCcqntAJOoZ_oBY9hxImcw';
let images = [];
let currentIndex = 0;
let intervalId;
let slideInterval = 1000;

const imgElement = document.getElementById('slideshow-image');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const intervalInput = document.getElementById('interval');
const categoryInput = document.getElementById('category-search');
const imageCountInput = document.getElementById('image-count');
const startBtn = document.getElementById('start-btn');
const cancelBtn = document.getElementById('cancel-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const downloadBtn = document.getElementById('download-btn');
const slideshowContainer = document.getElementById('slideshow-container');
const controlsContainer = document.querySelector('.controls');
const categorySelection = document.querySelector('.category-selection');

async function fetchImages(category, imageCount) {
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?client_id=${API_KEY}&query=${category}&per_page=${imageCount}`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      images = data.results.map(item => item.urls.regular);
      showImage();
      categorySelection.style.display = 'none';
      slideshowContainer.classList.remove('hidden');
      controlsContainer.classList.remove('hidden');
      slideshowContainer.style.opacity = 1;
      setIntervalTime();
    } else {
      alert('No images found for this category!');
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    alert('Failed to fetch images, please try again.');
  }
}

function showImage() {
  if (images.length > 0) {
    imgElement.src = images[currentIndex];
  }
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  showImage();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage();
}

function setIntervalTime() {
  clearInterval(intervalId);
  slideInterval = intervalInput.value * 1000;
  intervalId = setInterval(nextImage, slideInterval);
}

function cancelSlideshow() {
  clearInterval(intervalId);
  images = [];
  currentIndex = 0;
  imgElement.src = '';
  categorySelection.style.display = 'block';
  slideshowContainer.classList.add('hidden');
  controlsContainer.classList.add('hidden');
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    slideshowContainer.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

async function downloadImage() {
  try {
    const response = await fetch(imgElement.src);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'slideshow-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    alert('Could not download the image. Try again later.');
  }
}

prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);
intervalInput.addEventListener('change', setIntervalTime);
startBtn.addEventListener('click', () => {
  const category = categoryInput.value.trim();
  const imageCount = parseInt(imageCountInput.value, 10) || 10;
  fetchImages(category, imageCount);
});
cancelBtn.addEventListener('click', cancelSlideshow);
fullscreenBtn.addEventListener('click', toggleFullscreen);
downloadBtn.addEventListener('click', downloadImage);
