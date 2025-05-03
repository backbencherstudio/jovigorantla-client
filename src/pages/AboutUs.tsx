import React from "react";
import { useNavigate } from "react-router-dom";
const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white ">
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Connecting the South Asian Community Abroad
        </h2>
        <p className="text-gray-700 mb-4">
          Desieasy is a community-powered marketplace built to help South Asians
          living abroad feel more connected and at home. Whether you’re new to a
          city or just looking to connect with others in the local Desi network,
          our platform makes it easy to find housing, buy and sell items,
          discover job opportunities, and share rides — all within a culturally
          familiar space.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Built by the Community, for the Community
        </h2>
        <p className="text-gray-700 mb-4">
          At DesiEasy, we believe in the power of connection. We don’t offer
          services ourselves; we create the platform where you and your fellow
          community members can come together, support one another, and share
          what you need. It’s a space for Desis to help Desis — whether it’s
          finding a roommate, getting a ride, or sharing a job opportunity. It’s
          simple, easy to use, and designed for anyone, anywhere — so you can
          always be a part of your community, no matter where life takes you.
        </p>
      </section>

      <section className="mb-8"></section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
        <p className="text-gray-700">
          Have questions or suggestions? We'd love to hear from you!
        </p>
        <p className="text-gray-700 mt-2">
          Email:{" "}
          <a
            href="mailto:support@desieasy.com"
            className="text-brand hover:underline"
          >
            support@desieasy.com
          </a>
        </p>
      </section>
      <div className="mt-10">
        <div className="flex  gap-2">
          <p
            onClick={() => navigate("/privacy-policy")}
            className="text-xs text-gray-500 hover:underline cursor-pointer"
          >
            Privacy Policy
          </p>
          <p
            onClick={() => navigate("/user-agreement")}
            className="text-xs text-gray-500 hover:underline cursor-pointer"
          >
            User Agreement
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Desieasy © 2025. All rights reserved.
        </p>
      </div>
    </div>
  );
};
export default AboutUs;
