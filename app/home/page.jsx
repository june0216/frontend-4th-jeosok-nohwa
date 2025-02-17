"use client";

import React, { useState, useEffect } from "react";
import MyCalendar from "../../components/calendar/MyCalendar";
import NavBar from "../../components/common/NavBar";
import Timeline from "../../components/timeline/Timeline";
import SkeletonLoader from "@/components/home/SkeletonLoader";
import CommonHeader from "@/components/common/CommonHeader";

export default function CalandarPage() {
    const getTodayDate = () => new Date().toLocaleDateString("en-CA");
    const [selectedDate, setSelectedDate] = useState(() => {
        if (typeof window !== "undefined") {
            const storedDate = localStorage.getItem("selectedDate");
            const todayDate = getTodayDate();
            if (!storedDate || storedDate < todayDate){
                localStorage.setItem("selectedDate", todayDate);
                return todayDate;
            }
            return todayDate;
        }
        return new Date().toLocaleDateString("en-CA");
    });

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const getRandomImage = () => {
        const images = [
            "/image/random1.png",
            "/image/random2.png",
            "/image/random3.png",
        ];
        return images[Math.floor(Math.random() * images.length)];
    };

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/events");
                const result = await response.json();

                if (!result.success) {
                    console.error("API Error:", result.error);
                    return;
                }

                setEvents(
                    result.events.map((event) => ({
                        date: event.chat_date,
                        time: event.created_at
                            ? new Date(event.created_at).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "00:00",
                        title: event.title,
                        summary: event.summary,
                        imageSrc: getRandomImage(),
                    }))
                );
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);


    const handleDateClick = (date) => {
        const formattedDate = date.toLocaleDateString("en-CA");
        setSelectedDate(formattedDate);
        localStorage.setItem("selectedDate", formattedDate);
    };

    const filteredEvents = events.filter((event) => event.date === selectedDate);
    console.log(selectedDate)

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] w-full pt-12">
            {/* ✅ CommonHeader */}
            <CommonHeader selectedDate={selectedDate} />

            {/* ✅ CommonHeader 높이를 고려하여 padding 추가 */}
            <div className="flex flex-col items-center w-full min-h-[calc(100vh-64px)] pt-2">

                {loading ? (
                    <div className="flex flex-col w-full items-center">
                        <SkeletonLoader className="w-full max-w-md mt-4"/>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        <div className="w-full max-w-md mt-2">
                            <MyCalendar onClickDay={handleDateClick}/>

                            {/* ✅ 달력과 타임라인 사이 간격 추가 */}
                            <div className="mt-4"></div>

                            {/* ✅ Timeline도 동일한 max-w-md 적용 */}
                            <div className="w-full flex justify-center">
                                <Timeline events={filteredEvents} className="w-full max-w-md"/>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ✅ NavBar가 페이지 하단에 고정되도록 설정 */}
            <NavBar className="w-full fixed bottom-0"/>
        </div>

    );
}
