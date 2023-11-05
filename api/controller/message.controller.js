import Message from "../model/message.model.js"
import  Conversation from "../model/conversation.model.js"


export const createMessage = async (req, res, next) => {
    const newMessage = new Message({
      conversationId: req.body.conversationId,
      userId: req.userId,
      desc: sanitizeDescription(req.body.desc),
      img: req.body.img,
      docUrl: req.body.docUrl,
      docName: req.body.docName
    });
    try {
      const savedMessage = await newMessage.save();
      await Conversation.findOneAndUpdate(
        { id: req.body.conversationId },
        {
          $set: {
            readBySeller: req.isSeller,
            readByBuyer: !req.isSeller,
            lastMessage: sanitizeDescription(req.body.desc),
          },
        },
        { new: true }
      );
  
      res.status(201).send(savedMessage);
    } catch (err) {
      next(err);
    }
  };

  function sanitizeDescription(description) {
    // Regular expression to match mobile numbers
    const mobileNumberRegex = /\b\d{10}\b/g;
  
    // Regular expression to match social media links (assuming they start with http or https)
    const socialMediaLinkRegex = /https?:\/\/(www\.)?(facebook|twitter|instagram|linkedin|youtube)\.com\/\S+/g;
  
    // Replace mobile numbers and social media links with empty strings
    const sanitizedDescription = description
      .replace(mobileNumberRegex, '')
      .replace(socialMediaLinkRegex, '');
  
    return sanitizedDescription.trim(); // Trim any leading or trailing spaces
  }


  export const getMessages = async (req, res, next) => {
    try {
      const messages = await Message.find({ conversationId: req.params.id });
      res.status(200).send(messages);
    } catch (err) {
      next(err);
    }
  };