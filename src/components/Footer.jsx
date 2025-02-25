import React from 'react'
import { FaPhoneSquareAlt } from "react-icons/fa";
import { FaGooglePlus } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
    <div>
  <footer className="footer bg-blue-950 text-white p-10 flex justify-between">
    <nav>
      <h6 className="text-white font-bold text-lg">Quick Links</h6>
      <a className="link link-hover">Home</a>
      <a className="link link-hover">Jobs</a>
      <a className="link link-hover">Companies</a>
    </nav>
    <nav>
      <h6 className="text-white font-bold text-lg">About Us</h6>
      <a className="link link-hover">Our Story</a>
      <a className="link link-hover">Careers</a>
      <a className="link link-hover">Contact</a>
    </nav>
    <nav>
      <h6 className="text-white font-bold text-lg">Support</h6>
      <a className="link link-hover">Help Center</a>
      <a className="link link-hover">FAQs</a>
      <a className="link link-hover">Privacy Policy</a>
    </nav>
  </footer>
</div>

<footer className="footer bg-blue-950 text-white border-base-300 border-t px-10 py-4 justify-between">
   <nav className="md:place-self-center md:justify-self-start">
    <div className="grid grid-flow-col gap-10 ">
      <a className='text-2xl'>
      <FaPhoneSquareAlt />
      </a>
      <a className='text-2xl'>
      <FaGooglePlus />
      </a>
      <a className='text-2xl'>
      <FaFacebook />
      </a>
      <a className='text-2xl'>
      <FaLinkedin />
      </a>
    </div>
  </nav>
  <nav className="md:place-self-center md:justify-self-end">
  <p>Copyright © {new Date().getFullYear()} AskHire. All right reserved</p>
  </nav>
</footer>
    </div>
  )
}

export default Footer