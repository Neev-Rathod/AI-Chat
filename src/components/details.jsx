import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Ticket,
  Building2,
  MessageCircle,
  User,
  Settings,
  Building,
  Cloud,
  CreditCard,
  Bug,
} from "lucide-react";

const Details = ({ activeChatData }) => {
  const [openAccordions, setOpenAccordions] = useState({
    links: false,
    userData: false,
    conversationAttribute: false,
    companyDetails: false,
    salesforce: false,
    stripe: false,
    jira: false,
  });

  const toggleAccordion = (section) => {
    // Only allow the first accordion (links) to work
    if (section === "links") {
      setOpenAccordions((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    }
  };

  const AccordionHeader = ({ title, section }) => (
    <div
      className="flex items-center justify-between p-3 py-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
      onClick={() => toggleAccordion(section)}
    >
      <div className="flex items-center justify-between w-full space-x-3 font-bold">
        <span className=" text-gray-900">{title}</span>
        {openAccordions[section] ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500 rotate-[-90deg]" />
        )}
      </div>
    </div>
  );

  const LinkItem = ({ icon: Icon, title }) => (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-600" />
        <div>
          <div className="font-medium text-gray-900">{title}</div>
        </div>
      </div>
      <button className="p-1.5 bg-gray-100 rounded-lg transition-colors">
        <Plus className="w-4 h-4 stroke-3" />
      </button>
    </div>
  );

  return (
    <motion.div
      key="details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-4 overflow-y-auto"
    >
      <div className="space-y-4">
        {/* Header Info */}
        <div className=" p-4 border-b border-gray-300">
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Assignee</p>
              <div className="font-medium">
                {activeChatData?.name || "Unassigned"}
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Team</p>
              <div className="font-medium">Unassigned</div>
            </div>
          </div>
        </div>

        {/* Accordions */}
        <div className="rounded-lg ">
          {/* Links Accordion */}
          <div className="border-b border-gray-200 last:border-b-0">
            <AccordionHeader title="Links" section="links" />
            {openAccordions.links && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-100"
              >
                <div className="p-3 space-y-2">
                  <LinkItem icon={Ticket} title="Tracker Ticket" />
                  <LinkItem icon={Building2} title="Back Office Ticket" />
                  <LinkItem icon={MessageCircle} title="Side Conversation" />
                </div>
              </motion.div>
            )}
          </div>

          {/* User Data Accordion */}
          <div className="border-b border-gray-200 last:border-b-0">
            <AccordionHeader title="User Data" section="userData" />
          </div>

          {/* Conversation Attribute Accordion */}
          <div className="border-b border-gray-200 last:border-b-0">
            <AccordionHeader
              title="Conversation Attribute"
              section="conversationAttribute"
            />
          </div>

          {/* Company Details Accordion */}
          <div className="border-b border-gray-200 last:border-b-0">
            <AccordionHeader title="Company Details" section="companyDetails" />
          </div>

          {/* Salesforce Accordion */}
          <div className="border-b border-gray-200 last:border-b-0">
            <AccordionHeader title="Salesforce" section="salesforce" />
          </div>

          {/* Stripe Accordion */}
          <div className="border-b border-gray-200 last:border-b-0">
            <AccordionHeader title="Stripe" section="stripe" />
          </div>

          {/* Jira Accordion */}
          <div className="border-b border-gray-200 last:border-b-0">
            <AccordionHeader title="Jira" section="jira" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Details;
