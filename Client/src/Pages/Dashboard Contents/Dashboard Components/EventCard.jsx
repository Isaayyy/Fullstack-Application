import { useState } from "react";
import "../Dashboard Component Styles/EventCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faEdit,
  faTrashAlt,
  faArchive,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";
import EventModal from "./EventModal";
import Modal from "react-modal";
import { customModalStyles } from "../Dashboard Style/DashboardModalStyle";
import EditEvents from "./EditEvents";

const EventCard = ({ event, onDelete, onEditSuccess  }) => {
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setArchiveModalOpen] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    eventTitle: "",
    eventDate: "",
    eventStartTime: "",
    eventEndTime: "",
    eventCategory: "",
    eventDescription: "",
    eventHost: "",
    eventLocation: "",
    thumbnailFile: null,
  });

  //OPEN EDIT MODAL

  const openModal = () => {
    setModalIsOpen(true);
    setFormData({
      eventTitle: event.eventTitle,
      eventDate: event.eventDate,
      eventStartTime: event.eventStartTime,
      eventEndTime: event.eventEndTime,
      eventCategory: event.eventCategory,
      eventDescription: event.eventDescription,
      eventHost: event.eventHost,
      eventLocation: event.eventLocation,
      thumbnailFile: null, // You may want to add logic for handling the thumbnail
    });
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // OPEN MODALS

  const handleDeleteClick = (id) => {
    setSelectedRequestId(id);
    setDeleteModalOpen(true);
  };

  const handleArchiveClick = (id) => {
    setSelectedRequestId(id);
    setArchiveModalOpen(true);
  };

  const handleEventModalOpen = () => {
    setEventModalOpen(true);
  };

  // CLOSE MODALS

  const handleDeleteCancel = () => {
    setSelectedRequestId(null);
    setDeleteModalOpen(false);
  };

  const handleArchiveCancel = () => {
    setSelectedRequestId(null);
    setArchiveModalOpen(false);
  };

  const handleEventModalClose = () => {
    setEventModalOpen(false);
  };

  //MODAL CRUD OPERTAIONS

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `/event/deleteeventid/${selectedRequestId}`
      );
      toast.success(response.data.message);
      onDelete(selectedRequestId);
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error("Error deleting event");
    }
  };

  const handleArchiveConfirm = async () => {
    try {
      const response = await axios.put(
        `/event/archiveEvent/${selectedRequestId}`
      );
      toast.success(response.data.message);
      onDelete(selectedRequestId);
      setArchiveModalOpen(false);
    } catch (error) {
      toast.error("Error archiving event");
    }
  };

  const formattedDate =
    event.eventDate.substring(5, 7) +
    "/" +
    event.eventDate.substring(8, 10) +
    "/" +
    event.eventDate.substring(0, 4);

  return (
    <div className="event-card">
      <div className="event-card-img">
        <img
          src={event.eventThumbnailImageUrl}
          className="event-card-image"
          alt={event.eventTitle}
        />
      </div>
      <div className="event-icons">
        <div className="icon-container" onClick={openModal}>
          <FontAwesomeIcon icon={faEdit} />
        </div>
        <div
          className="icon-container"
          onClick={() => handleDeleteClick(event._id)}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </div>
        <div
          className="icon-container"
          onClick={() => handleArchiveClick(event._id)}
        >
          <FontAwesomeIcon icon={faArchive} />
        </div>
      </div>
      <div className="event-card-info">
        <div className="event-card-text">
          <p className="event-text-title">{event.eventTitle}</p>
          <p className="event-text-details">{formattedDate} </p>
        </div>
        <div
          className="event-card-button"
          id="display_event_modal"
          onClick={handleEventModalOpen} // Add click event to open EventModal
        >
          <svg viewBox="0 0 28 25" className="event-icon">
            <path d="M13.145 2.13l1.94-1.867 12.178 12-12.178 12-1.94-1.867 8.931-8.8H.737V10.93h21.339z" />
          </svg>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isArchiveModalOpen}
        onCancel={handleArchiveCancel}
        onConfirm={handleArchiveConfirm}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <EventModal
        isEventOpen={isEventModalOpen}
        onEventClose={handleEventModalClose}
        event={event}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create Events Modal"
        style={customModalStyles}
      >
        <div>
          <EditEvents
            onCloseModal={closeModal}
            closeModal={closeModal}
            eventId={event._id}
            formData={formData}
            onEditSuccess={onEditSuccess}
          />
        </div>
      </Modal>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    eventThumbnailImageUrl: PropTypes.string.isRequired,
    eventTitle: PropTypes.string.isRequired,
    eventCategory: PropTypes.oneOf(["church", "outreach"]).isRequired,
    eventDate: PropTypes.string.isRequired,
    eventStartTime: PropTypes.string.isRequired,
    eventEndTime: PropTypes.string.isRequired,
    eventDescription: PropTypes.string.isRequired,
    eventHost: PropTypes.string.isRequired,
    eventLocation: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  onEditSuccess: PropTypes.func, // Add this line for onEditSuccess
};


export default EventCard;
