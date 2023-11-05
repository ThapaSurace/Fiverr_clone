// Modal.js
import React, { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [currentContent, setCurrentContent] = useState("login");

  const openModal = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
    setCurrentContent("login")
  };

  return (
    <AuthModalContext.Provider value={{ openModal, closeModal, modalContent, currentContent, setCurrentContent }}>
      {children}
      {modalContent}
    </AuthModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(AuthModalContext);
};
