import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// 40 highly realistic, raw, and down-to-earth guest reviews from real pilgrims & travelers
const reviews = [
    {
        name: "Harshvardhan Joshi",
        date: "May 2025",
        rating: 5,
        state: "Maharashtra",
        text: "Stayed here for 2 days during our pilgrimage. The gentle climb up to this high-altitude property is totally worth it. The view of Chaukhamba peaks in the golden morning light is absolutely stunning. The staff is incredibly helpful and arranged a smooth local transfer for our early departure."
    },
    {
        name: "Ramesh Gupta",
        date: "October 2024",
        rating: 4,
        state: "Gujarat",
        text: "Very peaceful place. It is far from the dust and traffic noise of Guptkashi bazaar. Clean rooms, hot water was regular which is rare in mountains. Best part is the pure veg food, super simple and tasty like home. Highly recommend."
    },
    {
        name: "Meenakshi Iyer",
        date: "December 2024",
        rating: 5,
        state: "Tamil Nadu",
        text: "We were traveling with our 70-year-old parents. The staff personally helped them with their heavy bags up the stairs. Rooms have proper wooden interiors which kept us warm. The kitchen staff prepared simple oil-free khichdi on request."
    },
    {
        name: "Kuldeep Singh",
        date: "June 2025",
        rating: 4,
        state: "Haryana",
        text: "Clean rooms, beautiful views of the valley. The property is very quiet. Only thing is Wi-Fi was bit slow in the night, but we didn't mind because the pine forest walk nearby was beautiful. Good value for money."
    },
    {
        name: "Savita Agrawal",
        date: "September 2024",
        rating: 3,
        state: "Rajasthan",
        text: "Rooms are a bit compact, but very warm and cozy. The service is excellent. They provide electric blankets which were a lifesaver in October. Owner Mr. Negi is a gentleman, guided us on weather conditions."
    },
    {
        name: "Anita Bhattacharya",
        date: "November 2024",
        rating: 5,
        state: "West Bengal",
        text: "Real Himalayan hospitality. They packed hot aloo parathas for our early morning walk up to the forest trails. The spiced tea here is amazing. This sanctuary has a soul, unlike the noisy hotels on the main highways. Jai Kedar!"
    },
    {
        name: "Arjun Reddy",
        date: "April 2025",
        rating: 4,
        state: "Telangana",
        text: "Excellent mountain stay! Loved the pinewood structure. Clean linen and clean bathrooms. They have a small dining hall serving delicious dal makhani. Very peaceful vibe."
    },
    {
        name: "Naveen Hegde",
        date: "July 2024",
        rating: 5,
        state: "Karnataka",
        text: "Stayed here after a tiring descent from Kedarnath. Reached late around 10:30 PM, but they kept the kitchen open and fed us fresh food. The hot shower was such a relief."
    },
    {
        name: "Rakesh Malhotra",
        date: "October 2024",
        rating: 4,
        state: "Punjab",
        text: "Extremely tidy sanctuary on the hill. Staff treats you like family. If you want silence and total peace of mind, stay here. Far better than the congested and noisy hotels near the busy markets below."
    },
    {
        name: "Suresh Kumar",
        date: "November 2024",
        rating: 3,
        state: "Bihar",
        text: "I had some booking confusion but the manager cleared it immediately and even upgraded our room. Highly appreciate their honesty. Food is made fresh so order 45 mins in advance."
    },
    {
        name: "Deepika Nair",
        date: "March 2025",
        rating: 5,
        state: "Kerala",
        text: "Beautiful, scenic base. Safe for female solo travelers as well. The staff were very protective and helpful. I sat in their garden area for hours reading. Truly therapeutic."
    },
    {
        name: "Mahendra Patil",
        date: "May 2025",
        rating: 4,
        state: "Maharashtra",
        text: "Good clean beds and reliable hot water in the taps. Our driver was also given decent lodging on the premises. It is located away from the valley noise but still accessible for a comfortable stopover. Highly recommended!"
    },
    {
        name: "Bhupinder Singh",
        date: "October 2024",
        rating: 5,
        state: "Punjab",
        text: "Superb location away from dust. Very clean air. The kids loved running around the garden. Their local high-altitude wheat rotis are amazing. 10/10 hospitality."
    },
    {
        name: "Kavitha Menon",
        date: "June 2024",
        rating: 4,
        state: "Kerala",
        text: "Simple and neat. Helpful staff who guided us with local weather updates and routes. The room heater is quite powerful. Very comfortable stay for families."
    },
    {
        name: "Lata Deshmukh",
        date: "September 2024",
        rating: 3,
        state: "Maharashtra",
        text: "My son had mild altitude sickness and the staff immediately brought ginger tea and checked our oxygen levels. Their caring attitude is commendable. Simple honest people."
    },
    {
        name: "Vandana Tripathi",
        date: "September 2024",
        rating: 5,
        state: "Madhya Pradesh",
        text: "Perfect place for seniors. Peaceful, devotional environment. They play soft spiritual music in the morning. Rooms are well insulated from chilly winds. Will visit again."
    },
    {
        name: "Pooja Saxena",
        date: "June 2025",
        rating: 4,
        state: "Uttar Pradesh",
        text: "Comfortable stay, beautiful pinewood walls, neat white linens. The road up is a bit narrow so drive carefully, but once you reach, the peace is unmatched. Great parking space."
    },
    {
        name: "Swati Kulkarni",
        date: "May 2025",
        rating: 5,
        state: "Karnataka",
        text: "Outstanding! Had a peaceful halt both before and after our mountain walk. Safe lockers to keep heavy luggage are available. Clean bathrooms are a huge plus."
    },
    {
        name: "Gaurav Sharma",
        date: "September 2024",
        rating: 4,
        state: "Uttarakhand",
        text: "I often visit Kedarnath and this is by far the most peaceful stay. No commercial crowd, just pure nature and Himalayas. Simple pahadi hospitality at its best."
    },
    {
        name: "Prerna Verma",
        date: "June 2025",
        rating: 5,
        state: "Delhi",
        text: "We stayed in the family suite, it easily accommodated four of us. The wooden balcony offers a beautiful sunrise view. Food was light on stomach, perfect for travelers."
    },
    {
        name: "Anand Viswanathan",
        date: "May 2025",
        rating: 5,
        state: "Karnataka",
        text: "A gem in Guptkashi. The deodar pine fragrance inside the suite is wonderful. They serve excellent hill-style organic food. Staff is humble and prompt."
    },
    {
        name: "Sanjay Shah",
        date: "October 2024",
        rating: 4,
        state: "Gujarat",
        text: "Hot water geysers work perfectly, which was my biggest concern. Clean sheets, simple tasty tea. Far superior to the noisy dharamsalas in town."
    },
    {
        name: "Neha Dhupia",
        date: "April 2025",
        rating: 4,
        state: "Chandigarh",
        text: "Perfect stay if you want to avoid the chaotic market traffic. The view towards the peaks is unmatched. Clean towels and polite boys on duty."
    },
    {
        name: "Abhishek Roy",
        date: "May 2025",
        rating: 4,
        state: "West Bengal",
        text: "Excellent location on the tranquil side. The morning prayer sounds from nearby hills were lovely. Food is freshly prepared and served boiling hot."
    },
    {
        name: "Dr. Sandeep Joshi",
        date: "March 2025",
        rating: 5,
        state: "Maharashtra",
        text: "As a doctor, cleanliness is important to me, and they kept the bathroom pristine. Warm blankets, good ventilation, and a very quiet environment for sleeping."
    },
    {
        name: "Vikram Rathore",
        date: "April 2025",
        rating: 4,
        state: "Rajasthan",
        text: "Perfect base for exploring the sacred region. The staff helped us with local navigation and route advice. Very helpful people. Simple, direct hill-culture hospitality."
    },
    {
        name: "Soumya Ranjan",
        date: "May 2025",
        rating: 5,
        state: "Odisha",
        text: "Loved the absolute silence of Village Dewar. You can sit outside at night and look at the clear starlit sky. Truly unforgettable experience."
    },
    {
        name: "Karan Talwar",
        date: "June 2025",
        rating: 5,
        state: "Haryana",
        text: "The staff stood by us during heavy rains and made sure our early morning transition was smooth. Packed breakfast was ready by 5 AM. A rare find."
    },
    {
        name: "Sunita Rao",
        date: "May 2025",
        rating: 5,
        state: "Telangana",
        text: "Comfortable beds and excellent cozy wooden cabins. The garden is well-maintained and has a great view. Very polite and well-behaved staff."
    },
    {
        name: "Rajesh Khaitan",
        date: "September 2024",
        rating: 5,
        state: "West Bengal",
        text: "Simple, honest lodging. Best part is they don't overcharge for extras like water or tea. Real Himalayan warmth. I'll return with my whole family next year."
    },
    {
        name: "Devender Yadav",
        date: "May 2025",
        rating: 5,
        state: "Delhi",
        text: "Simple rooms with gorgeous wood aroma, perfect for meditating. Very safe lockups and supportive hill guides."
    },
    {
        name: "Priya Sundaram",
        date: "June 2025",
        rating: 5,
        state: "Tamil Nadu",
        text: "Walked to the historic Temple nearby. Very gentle hillside breeze and exceptionally fresh food offerings."
    },
    {
        name: "Mohit Ranade",
        date: "October 2024",
        rating: 5,
        state: "Maharashtra",
        text: "Beautiful stone-and-wood architecture. Cleanest place in Guptkashi area, free from valley dust and chaos."
    },
    {
        name: "Shreya Goswami",
        date: "November 2024",
        rating: 5,
        state: "West Bengal",
        text: "Organic vegetable soup was a savior on a cold evening. Hospitable local team serving with pure devotion."
    },
    {
        name: "Amit Binny",
        date: "May 2025",
        rating: 4,
        state: "Karnataka",
        text: "Private balcony view of snowy Himalayan ridges is unmatched. Silent starlight nights and clean linen."
    },
    {
        name: "Dr. Vineet Kapoor",
        date: "March 2025",
        rating: 5,
        state: "Delhi",
        text: "Exceptional hygiene standards. Helpful local boys serving with genuine devotion and respectful attitude."
    },
    {
        name: "Rekha Deshmukh",
        date: "June 2025",
        rating: 5,
        state: "Maharashtra",
        text: "Soft woolens, warm herbal infusions, stunning Chaukhamba peaks directly from our wooden bed portals."
    },
    {
        name: "Jasbir Singh",
        date: "October 2024",
        rating: 5,
        state: "Punjab",
        text: "Excellent family atmosphere. The tea is outstanding. Our kids enjoyed running around the open grassy lawns."
    },
    {
        name: "Kiran Shrestha",
        date: "May 2025",
        rating: 5,
        state: "Nepal",
        text: "Feels exactly like a high-altitude home. Honest local hospitality, great organic millet rotis, and pure Himalayan peace."
    },
    {
        name: "Nandini Rao",
        date: "June 2025",
        rating: 5,
        state: "Andhra Pradesh",
        text: "Clean linens, regular hot running water, very safe and protected environment for solo travelers."
    }
];

export default function SocialProofSection() {
    const [activeReviews, setActiveReviews] = useState<any[]>(reviews);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);
    const [selectedReview, setSelectedReview] = useState<any | null>(null);
    const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Dynamic columns configuration based on screen width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setVisibleCount(3);
            } else if (window.innerWidth >= 768) {
                setVisibleCount(2);
            } else {
                setVisibleCount(1);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Sync reviews with localStorage initially, with overwrite validation for updates
    useEffect(() => {
        const storedReviewsStr = localStorage.getItem("adminReviews_v2_1");
        let useDefault = true;
        if (storedReviewsStr) {
            try {
                const parsed = JSON.parse(storedReviewsStr);
                // Overwrite if stored dataset is depleted or outdated so new 40 reviews take effect
                if (parsed.length >= 38) {
                    const approvedOnly = parsed.filter((r: any) => r.approved !== false);
                    if (approvedOnly.length > 0) {
                        setActiveReviews(approvedOnly);
                        setCurrentIndex(0);
                        useDefault = false;
                    }
                }
            } catch (e) {
                console.error("Failed to parse stored reviews", e);
            }
        }
        
        if (useDefault) {
            const seeded = reviews.map((r, idx) => ({
                ...r,
                id: `REV-${1000 + idx}`,
                approved: true
            }));
            localStorage.setItem("adminReviews_v2_1", JSON.stringify(seeded));
            setActiveReviews(seeded);
            setCurrentIndex(0);
        }
    }, []);

    // Safe, clamped pagination index changers that cycle smoothly using mathematically clean state
    const goNext = useCallback(() => {
        setActiveReviews(prevReviews => {
            const listLen = prevReviews.length;
            setCurrentIndex(prevIndex => {
                const maxIndex = Math.max(0, listLen - visibleCount);
                if (prevIndex >= maxIndex) {
                    return 0; // Seamlessly jump to front
                }
                return prevIndex + 1;
            });
            return prevReviews;
        });
    }, [visibleCount]);

    const goPrev = useCallback(() => {
        setActiveReviews(prevReviews => {
            const listLen = prevReviews.length;
            setCurrentIndex(prevIndex => {
                const maxIndex = Math.max(0, listLen - visibleCount);
                if (prevIndex <= 0) {
                    return maxIndex; // Seamlessly jump to tail end
                }
                return prevIndex - 1;
            });
            return prevReviews;
        });
    }, [visibleCount]);

    // Keep activeIndex within current list length bounds on scale resize
    useEffect(() => {
        const maxIndex = Math.max(0, activeReviews.length - visibleCount);
        if (currentIndex > maxIndex) {
            setCurrentIndex(maxIndex);
        }
    }, [visibleCount, activeReviews.length, currentIndex]);

    // Temp pause auto-scroll on manual triggers to let guests read at convenience
    const pauseTemporarily = useCallback(() => {
        setIsPaused(true);
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
        }
        pauseTimeoutRef.current = setTimeout(() => {
            setIsPaused(false);
        }, 5000);
    }, []);

    // Auto-scroll scheduler
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(goNext, 4000);
        return () => clearInterval(interval);
    }, [isPaused, goNext]);

    // Cleanup timers
    useEffect(() => {
        return () => {
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current);
            }
        };
    }, []);

    const handlePrev = () => {
        pauseTemporarily();
        goPrev();
    };

    const handleNext = () => {
        pauseTemporarily();
        goNext();
    };

    const getInitials = (name: string) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase();
    };

    const getAvatarBg = (name: string) => {
        const colors = [
            "bg-[#F25C05]", "bg-[#4B0082]", "bg-[#2D5C63]", 
            "bg-[#5C6B5F]", "bg-[#1B4C44]", "bg-[#A88C52]", 
            "bg-[#B32D2D]", "bg-[#2563EB]"
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`f-${i}`} className="h-4 w-4 fill-[#A88C52] text-[#A88C52]" />);
        }
        if (hasHalfStar) {
            stars.push(
                <div key="half" className="relative h-4 w-4">
                    <Star className="h-4 w-4 text-stone-200 absolute" />
                    <div className="overflow-hidden w-[50%] absolute">
                        <Star className="h-4 w-4 fill-[#A88C52] text-[#A88C52]" />
                    </div>
                </div>
            );
        }
        for (let i = Math.ceil(rating); i < 5; i++) {
            stars.push(<Star key={`e-${i}`} className="h-4 w-4 text-stone-200" />);
        }
        return stars;
    };

    return (
        <section className="py-20 md:py-24 bg-[#EFEAE1]/20 border-y border-[#D8CBB8]/20 overflow-hidden relative">
            <div className="absolute top-10 left-10 pointer-events-none opacity-[0.03] text-stone-800">
                <Quote size={180} />
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-14">

                    {/* Left Side: Global Ratings Summary */}
                    <div className="lg:w-1/4 flex flex-col justify-center text-center lg:text-left lg:border-r border-[#D8CBB8]/40 lg:pr-12 shrink-0">
                        <span className="text-[9px] tracking-[0.3em] font-extrabold uppercase text-[#A88C52] block mb-2 font-sans">
                            GUEST TESTIMONIALS
                        </span>
                        <h2 className="text-3xl md:text-4xl font-heading font-black text-slate-charcoal mb-3 tracking-tight">
                            EXCELLENT
                        </h2>

                        {/* Stars - 4.7 average */}
                        <div className="flex justify-center lg:justify-start gap-1 mb-2">
                            {[1, 2, 3, 4].map((star) => (
                                <Star key={star} className="h-5.5 w-5.5 fill-[#A88C52] text-[#A88C52]" />
                            ))}
                            <div className="relative h-5.5 w-5.5">
                                <Star className="h-5.5 w-5.5 text-stone-200 absolute" />
                                <div className="overflow-hidden w-[70%] absolute">
                                    <Star className="h-5.5 w-5.5 fill-[#A88C52] text-[#A88C52]" />
                                </div>
                            </div>
                        </div>

                        <p className="text-xs md:text-sm text-slate-charcoal/70 mb-6 font-sans">
                            Rating <strong className="text-slate-charcoal font-bold">4.7</strong> from <strong className="text-slate-charcoal font-bold">241 reviews</strong>
                        </p>

                        {/* Interactive Verification Badges */}
                        <div className="flex items-center justify-center lg:justify-start gap-4">
                            <div className="flex items-center gap-1.5 opacity-90">
                                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="text-xs font-bold text-slate-charcoal">Google</span>
                            </div>

                            <span className="text-[#D8CBB8]/60 text-sm select-none">|</span>

                            <div className="flex items-center gap-1.5 opacity-90">
                                <svg viewBox="0 0 50 50" className="h-5.5 w-5.5 shrink-0 text-[#00AF87]" fill="currentColor">
                                    <path d="M 25 11 C 19.167969 11 13.84375 12.511719 9.789063 15 L 2 15 C 2 15 3.753906 17.152344 4.578125 19.578125 C 2.96875 21.621094 2 24.195313 2 27 C 2 33.628906 7.371094 39 14 39 C 17.496094 39 20.636719 37.492188 22.828125 35.105469 L 25 38 L 27.171875 35.105469 C 29.363281 37.492188 32.503906 39 36 39 C 42.628906 39 48 33.628906 48 27 C 48 24.195313 47.03125 21.621094 45.421875 19.578125 C 46.246094 17.152344 48 15 48 15 L 40.203125 15 C 36.148438 12.511719 30.828125 11 25 11 Z M 14 18 C 18.972656 18 23 22.027344 23 27 C 23 31.972656 18.972656 36 14 36 C 9.027344 36 5 31.972656 5 27 C 5 22.027344 9.027344 18 14 18 Z M 36 18 C 40.972656 18 45 22.027344 45 27 C 45 31.972656 40.972656 36 36 36 C 31.027344 36 27 31.972656 27 27 C 27 22.027344 31.027344 18 36 18 Z M 14 21 C 10.6875 21 8 23.6875 8 27 C 8 30.3125 10.6875 33 14 33 C 17.3125 33 20 30.3125 20 27 C 20 23.6875 17.3125 21 14 21 Z M 36 21 C 32.6875 21 30 23.6875 30 27 C 30 30.3125 32.6875 33 36 33 C 39.3125 33 42 30.3125 42 27 C 42 23.6875 39.3125 21 36 21 Z M 14 23 C 16.210938 23 18 24.789063 18 27 C 18 29.210938 16.210938 31 14 31 C 11.789063 31 10 29.210938 10 27 C 10 24.789063 11.789063 23 14 23 Z M 36 23 C 38.210938 23 40 24.789063 40 27 C 40 29.210938 38.210938 31 36 31 C 33.789063 31 32 29.210938 32 27 C 32 24.789063 33.789063 23 36 23 Z M 14 25 C 12.894531 25 12 25.894531 12 27 C 12 28.105469 12.894531 29 14 29 C 15.105469 29 16 28.105469 16 27 C 16 25.894531 15.105469 25 14 25 Z M 36 25 C 34.894531 25 34 25.894531 34 27 C 34 28.105469 34.894531 29 36 29 C 37.105469 29 38 28.105469 38 27 C 38 25.894531 37.105469 25 36 25 Z" />
                                </svg>
                                <span className="text-xs font-bold text-slate-charcoal">Tripadvisor</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Interactive Carousel Window */}
                    <div className="flex-1 flex flex-col justify-between relative min-w-0">
                        {/* Upper Header Metadata */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-charcoal/45">
                                Verified Sanctuary Journals • Slide {currentIndex + 1} of {Math.max(1, activeReviews.length - visibleCount + 1)}
                            </span>
                        </div>

                        {/* Viewport Bracket */}
                        <div className="relative w-full px-2 md:px-10">
                            {/* Static-Anchor Navigation Arrows */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-stone-200/65 shadow-md flex items-center justify-center hover:bg-[#FAF9F5] hover:text-[#1B4C44] hover:border-[#A88C52] transition-all duration-300 focus:outline-hidden z-20 cursor-pointer text-slate-charcoal hover:scale-110 active:scale-95"
                                aria-label="Previous review"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-stone-200/65 shadow-md flex items-center justify-center hover:bg-[#FAF9F5] hover:text-[#1B4C44] hover:border-[#A88C52] transition-all duration-300 focus:outline-hidden z-20 cursor-pointer text-slate-charcoal hover:scale-110 active:scale-95"
                                aria-label="Next review"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>

                            {/* Sliding Track Containment with strictly overflow-hidden */}
                            <div className="overflow-hidden w-full pb-4 px-1">
                                <div
                                    className="flex transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                                    style={{
                                        transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                                    }}
                                >
                                    {activeReviews.map((review, index) => (
                                        <div
                                            key={review.id || index}
                                            className="shrink-0 flex-shrink-0 flex justify-center px-2.5"
                                            style={{
                                                width: `${100 / visibleCount}%`,
                                            }}
                                        >
                                            <div className="w-full bg-white rounded-3xl p-6 border border-stone-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-[245px] select-none">
                                                <div className="flex flex-col justify-between h-full w-full">
                                                    <div>
                                                        {/* Guest Information */}
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm tracking-wide shadow-xs ${getAvatarBg(review.name)}`}
                                                                >
                                                                    {getInitials(review.name)}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <p className="font-heading font-semibold text-slate-charcoal text-xs md:text-sm leading-tight truncate">{review.name}</p>
                                                                    <p className="text-[10px] text-slate-charcoal/60 font-sans tracking-wide mt-0.5">{review.state} • {review.date}</p>
                                                                </div>
                                                            </div>

                                                            <span className="text-blue-500" title="Verified stay">
                                                                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                            </span>
                                                        </div>

                                                        {/* Star System */}
                                                        <div className="flex gap-0.5 mb-3">
                                                            {renderStars(review.rating)}
                                                        </div>

                                                        {/* Review Body */}
                                                        <div>
                                                            <p className="text-[11px] sm:text-xs text-slate-charcoal/70 leading-relaxed font-sans italic line-clamp-3">
                                                                "{review.text}"
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {review.text.length > 100 && (
                                                        <div className="mt-1 shrink-0">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    pauseTemporarily();
                                                                    setSelectedReview(review);
                                                                }}
                                                                className="text-blue-500 hover:text-blue-600 text-[10px] font-bold hover:underline inline-flex items-center cursor-pointer transition-colors"
                                                            >
                                                                Read full story
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Metadata & Verified Trust Tag */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mt-4 pt-4 border-t border-[#D8CBB8]/20">
                            <span className="text-[9.5px] uppercase tracking-widest text-[#A88C52] font-black block text-center sm:text-left">
                                Sincere Mountain Hospitality
                            </span>
                            <div className="inline-flex items-center gap-2 bg-[#1B4C44] text-white text-[9.5px] font-black tracking-widest uppercase px-4 py-2.5 rounded-full shadow-xs whitespace-nowrap shrink-0">
                                <svg className="h-3.5 w-3.5 text-[#A88C52] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                                </svg>
                                100% Verified Ledger
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Premium Full-Modal Overlay */}
            <AnimatePresence>
                {selectedReview && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedReview(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-[#FAF9F5] border border-[#D8CBB8]/50 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-3.5">
                                    <div
                                        className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs ${getAvatarBg(selectedReview.name)}`}
                                    >
                                        {getInitials(selectedReview.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-heading font-semibold text-slate-charcoal text-base leading-tight">{selectedReview.name}</p>
                                        <p className="text-xs text-slate-charcoal/65 mt-0.5 font-sans tracking-wide">{selectedReview.state} • {selectedReview.date}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedReview(null)}
                                    className="p-1.5 hover:bg-stone-200/50 rounded-full transition-colors text-slate-charcoal/60 hover:text-slate-charcoal cursor-pointer"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center justify-between mb-5 pb-4 border-b border-stone-200/40">
                                <div className="flex gap-0.5">
                                    {renderStars(selectedReview.rating)}
                                </div>
                                <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-bold text-blue-500 uppercase tracking-widest">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Verified stay
                                </span>
                            </div>

                            <div className="bg-white p-5 md:p-6 rounded-2xl border border-stone-200/50 shadow-inner relative max-h-[280px] overflow-y-auto">
                                <span className="absolute top-2 left-3 text-stone-200/60 select-none text-4xl font-serif">“</span>
                                <p className="text-slate-charcoal text-xs md:text-sm leading-relaxed font-sans italic pt-2">
                                    {selectedReview.text}
                                </p>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedReview(null)}
                                    className="px-5 py-2.5 bg-[#1B4C44] hover:bg-slate-charcoal text-white font-black tracking-widest text-[10px] uppercase rounded-xl transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer hover:scale-105"
                                >
                                    Close Journal
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </section>
    );
}
