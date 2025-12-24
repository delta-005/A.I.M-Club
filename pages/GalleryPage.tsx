
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { GalleryItem } from '../types';
import { Icon } from '../components/icons';
import Modal from '../components/Modal';

const GalleryCard: React.FC<{ item: GalleryItem; onClick: (item: GalleryItem) => void; style?: React.CSSProperties }> = ({ item, onClick, style }) => (
    <div
        className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 mb-8 animate-fade-in"
        style={{ breakInside: 'avoid', perspective: '1000px', ...style }}
        onClick={() => onClick(item)}
    >
        <div className="transition-transform duration-500 ease-out group-hover:transform [transform:rotateY(-5deg)_rotateX(5deg)_scale(1.05)]">
            <img src={item.images[0]} alt={item.eventTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out bg-black/30 backdrop-blur-md">
                <h3 className="text-2xl font-bold">{item.eventTitle}</h3>
                <p className="text-sm opacity-80">{item.date}</p>
            </div>

            <div className="absolute bottom-0 left-0 p-6 text-white group-hover:opacity-0 transition-opacity duration-300">
                 <h3 className="text-2xl font-bold">{item.eventTitle}</h3>
            </div>
            
            <span className="absolute top-4 right-4 text-xs font-bold bg-neon-pink/80 px-3 py-1 rounded-full">{item.category}</span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Icon name="camera" className="w-12 h-12 text-white" />
            </div>
        </div>
    </div>
);


const GalleryModal: React.FC<{ item: GalleryItem | null; onClose: () => void }> = ({ item, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (item) {
            setCurrentImageIndex(0);
        }
    }, [item]);

    if (!item) return null;

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);

    const handleDownload = () => {
        const imageUrl = item.images[currentImageIndex];
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `AIM_Gallery_${item.eventTitle}_${currentImageIndex + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Modal isOpen={!!item} onClose={onClose} title={`${item.eventTitle} (${currentImageIndex + 1}/${item.images.length})`} size="4xl">
            <div className="relative group">
                <img src={item.images[currentImageIndex]} alt={`${item.eventTitle} - ${currentImageIndex + 1}`} className="w-full max-h-[70vh] object-contain rounded-lg" />
                
                {item.images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors z-10 text-xl">
                            &#10094;
                        </button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors z-10 text-xl">
                            &#10095;
                        </button>
                    </>
                )}

                <button 
                    onClick={handleDownload}
                    className="absolute top-4 right-4 bg-neon-blue text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 font-bold text-xs uppercase"
                >
                    <Icon name="download" className="w-4 h-4" /> Download
                </button>
            </div>
            {item.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2 overflow-x-auto p-2">
                    {item.images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt=""
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-20 h-20 object-cover rounded-md cursor-pointer border-4 transition-all ${index === currentImageIndex ? 'border-neon-blue scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        />
                    ))}
                </div>
            )}
        </Modal>
    );
};

const GalleryHero: React.FC<{ images: string[] }> = ({ images }) => {
    const mosaicLayout = useMemo(() => [
        { r: 2, c: 2 }, 
        { r: 1, c: 2 }, 
        { r: 1, c: 1 }, 
        { r: 1, c: 1 }, 
        { r: 2, c: 1 }, 
        { r: 1, c: 2 }, 
        { r: 1, c: 1 }, 
        { r: 1, c: 1 }, 
        { r: 2, c: 2 }, 
        { r: 1, c: 1 }, 
        { r: 1, c: 1 }, 
        { r: 1, c: 2 }, 
        { r: 1, c: 2 }, 
    ], []);

    const displayImages = useMemo(() => {
        if (!images || images.length === 0) return [];
        let extendedImages = [];
        while (extendedImages.length < mosaicLayout.length) {
            extendedImages.push(...images);
        }
        return extendedImages.slice(0, mosaicLayout.length);
    }, [images, mosaicLayout.length]);

    return (
        <header className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden bg-dark-bg">
            <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 grid-rows-4 grid-flow-dense gap-2 p-2 opacity-40 brightness-110">
                {displayImages.map((src, i) => (
                    <div 
                        key={i} 
                        className="bg-cover bg-center animate-pulse rounded-lg overflow-hidden" 
                        style={{ 
                            backgroundImage: `url(${src})`,
                            gridRow: `span ${mosaicLayout[i].r}`,
                            gridColumn: `span ${mosaicLayout[i].c}`,
                            animationDuration: `${Math.random() * 5 + 8}s`, 
                            animationDelay: `${Math.random() * 3}s`
                        }} 
                    />
                ))}
            </div>
            <div className="absolute inset-0 bg-dark-bg [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            <div className="relative z-10 animate-fade-in">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase font-orbitron drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-golden-yellow via-white to-golden-yellow">
                        Gallery
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-2xl mx-auto">
                    Visual Chronicles of Our Innovations and Collaborations.
                </p>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
                <Icon name="chevronDown" className="w-8 h-8 text-white/50 animate-bounce" />
            </div>
        </header>
    );
};

const GalleryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    
    const appContext = useContext(AppContext);
    const galleryItems = appContext?.galleryItems || [];

    const categories = useMemo(() => ['All', ...Array.from(new Set(galleryItems.map(item => item.category)))], [galleryItems]);
    const allImages = useMemo(() => galleryItems.flatMap(item => item.images), [galleryItems]);

    const filteredItems = useMemo(() => {
        return galleryItems
            .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
            .filter(item => item.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, selectedCategory, galleryItems]);

    return (
        <div className="animate-fade-in bg-white dark:bg-dark-bg">
            <GalleryHero images={allImages} />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-10">
                <div className="mb-12 flex flex-col md:flex-row gap-4 justify-between items-center p-4 bg-white/10 dark:bg-gray-800/30 rounded-2xl backdrop-blur-md border border-white/20 dark:border-gray-700/50">
                     <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search by event title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 bg-transparent border-b-2 border-gray-400 dark:border-gray-600 focus:outline-none focus:border-neon-blue transition-colors"
                        />
                         <Icon name="logo" className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${selectedCategory === cat ? 'bg-white dark:bg-gray-900 text-neon-blue shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredItems.length > 0 ? (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8">
                        {filteredItems.map((item, index) => (
                            <GalleryCard key={item.id} item={item} onClick={setSelectedItem} style={{ animationDelay: `${index * 50}ms`}} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center col-span-full py-16">
                        <Icon name="camera" className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-xl text-gray-500 dark:text-gray-400">No Memories Found</p>
                        <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>

            <GalleryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
    );
};

export default GalleryPage;
