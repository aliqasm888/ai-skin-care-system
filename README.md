# AI Skin Care System

## Overview

AI Skin Care System is an intelligent backend platform that combines artificial intelligence with web development to provide automated skin analysis and personalized skincare recommendations. The system is designed to act as a smart digital assistant that helps users understand their skin condition, receive tailored skincare routines, and track improvements over time.

The platform allows users to create an account and interact with the system by uploading facial images. These images are analyzed using an AI-based computer vision model to detect potential skin issues. The system then processes the results and generates personalized recommendations based on the user’s condition, making the experience adaptive and user-specific.

In addition to image analysis, the system includes an interactive knowledge-based component that asks users targeted questions to improve the accuracy of the diagnosis. This combination of AI detection and rule-based reasoning enhances the reliability of the results.

The system also provides a progress tracking feature that enables users to monitor changes in their skin condition over time by comparing previously uploaded images. Furthermore, it includes a service booking module that connects users with skincare and beauty services, allowing them to follow professional treatments based on the system’s recommendations.

---

## Technologies Used

The system is built using modern backend and AI-related technologies. The core backend is developed using Node.js and Express.js, with TypeScript used for type safety and better code structure. MongoDB is used as the database to store user data, analysis results, and service-related information.

Authentication and security are handled using JWT (JSON Web Tokens) along with password hashing techniques. Input validation is implemented to ensure data integrity and system reliability. The AI component is based on computer vision techniques, specifically a YOLO-based model for image analysis and detection.

The system follows a modular and scalable backend architecture that separates business logic, request handling, and data access layers to ensure maintainability and extensibility.

---

## Project Functionality

The main functionality of the system can be summarized as follows:

The user interacts with the platform by registering and logging into the system. After authentication, the user can upload facial images which are processed by an AI model to detect skin conditions. Based on the analysis results, the system generates personalized skincare recommendations and routines tailored to the user’s needs.

To improve accuracy, the system engages the user in a guided question-based process that helps refine the diagnosis. The user can also track their skin progress over time by uploading new images and comparing results.

In addition, the system provides access to skincare and beauty services where users can book treatments based on their condition and recommendations.

---

## System Goal

The main goal of the project is to bridge the gap between artificial intelligence and real-world skincare applications by building a smart assistant that provides automated diagnosis, personalized care suggestions, and practical service integration in a single unified system.

---

## Summary

AI Skin Care System represents a complete backend solution that integrates artificial intelligence, recommendation systems, and service management. It demonstrates how modern AI technologies can be applied in healthcare and personal care domains to deliver intelligent, user-focused solutions.
