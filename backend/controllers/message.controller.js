import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const sendMessage=async (req,res)=>{
    const { content, chatId, requestedObject } = req.body;
    if ((!content && !requestedObject) || !chatId) {
      return res
        .status(400)
        .json({ success: false, message: "Données manquantes !" });
    }


    try {
        let newMessage=await Message.create({
            sender:req.user._id,
            content,
            chat:chatId,
            requestedObject:requestedObject ||" "
        }) ;

        newMessage=await newMessage.populate("sender","firstName lastName email"); //remplacer la référence de sender par le vrai document sender
        newMessage=await newMessage.populate("chat");
        newMessage=await Chat.populate(newMessage,{path:"chat.users",select:"firstName lastName email"});

        //m a j latest message de la conversation
        await Chat.findByIdAndUpdate(chatId,{latestMessage:newMessage._id});
        res.status(201).json({ success: true, data: newMessage });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message:"erreur serveur" });
    }
}


export const getMessages=async (req,res)=>{
    try {
        const messages=await Message.find({chat:req.params.chatId})
        .populate("sender","firstName lastName email")
        .populate("chat");

        res.status(200).json({success:true,data:messages})
    } catch (error) {
        console.log(error)
        res.status(501).json({success:false,message:"erreur serveur"})
    }
}