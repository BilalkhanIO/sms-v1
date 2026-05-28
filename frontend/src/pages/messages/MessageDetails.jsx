import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Reply, Trash2 } from 'lucide-react';
import { useGetMessageByIdQuery, useMarkAsReadMutation, useDeleteMessageMutation, useSendMessageMutation } from '../../api/messageApi';
import PageHeader from '../../components/common/PageHeader';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { useUIStore } from '../../store/zustand/useUIStore';

const MessageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);
  const openConfirm = useUIStore((s) => s.openConfirm);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [sending, setSending] = useState(false);

  const { data, isLoading, isError } = useGetMessageByIdQuery(id);
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [sendMessage] = useSendMessageMutation();

  const message = data?.data || data;

  useEffect(() => {
    if (message && !message.isRead) {
      markAsRead(id);
    }
  }, [message, id]);

  const handleDelete = () => {
    openConfirm({
      title: 'Delete Message',
      message: 'Are you sure you want to delete this message?',
      danger: true,
      onConfirm: async () => {
        try {
          await deleteMessage(id).unwrap();
          navigate('/dashboard/messages');
        } catch {
          addToast({ type: 'error', title: 'Delete failed' });
        }
      },
    });
  };

  const handleReply = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await sendMessage({
        recipients: [message.sender?._id],
        subject: `Re: ${message.subject || ''}`,
        body: replyBody,
        type: 'DIRECT',
        parentMessage: message._id,
      }).unwrap();
      addToast({ type: 'success', title: 'Reply sent' });
      setReplyOpen(false);
      setReplyBody('');
    } catch (err) {
      addToast({ type: 'error', title: 'Reply failed', message: err.data?.message });
    } finally {
      setSending(false);
    }
  };

  if (isLoading) return <Spinner />;
  if (isError || !message) return <div className="text-red-500 p-4">Message not found.</div>;

  const from = message.sender
    ? `${message.sender.firstName ?? ''} ${message.sender.lastName ?? ''}`.trim()
    : 'Unknown';
  const to = message.recipients
    ?.map((r) => `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim())
    .join(', ') || '—';

  return (
    <div>
      <PageHeader
        title={message.subject || '(no subject)'}
        backUrl="/dashboard/messages"
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setReplyOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg"
            >
              <Reply className="h-4 w-4" /> Reply
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 space-y-1">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="text-gray-500 w-12">From:</span>
            <span className="font-medium text-gray-900">{from}</span>
          </div>
          <div className="flex items-baseline gap-2 text-sm">
            <span className="text-gray-500 w-12">To:</span>
            <span className="text-gray-700">{to}</span>
          </div>
          <div className="flex items-baseline gap-2 text-sm">
            <span className="text-gray-500 w-12">Date:</span>
            <span className="text-gray-500">
              {message.createdAt ? new Date(message.createdAt).toLocaleString() : '—'}
            </span>
          </div>
          {message.type !== 'DIRECT' && (
            <div className="flex items-baseline gap-2 text-sm">
              <span className="text-gray-500 w-12">Type:</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {message.type}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{message.body}</p>
        </div>
      </div>

      {/* Reply Modal */}
      <Modal isOpen={replyOpen} onClose={() => setReplyOpen(false)} title={`Reply to ${from}`} size="lg">
        <form onSubmit={handleReply} className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500 border-l-4 border-gray-200">
            <p className="font-medium text-gray-700 mb-1">Original message:</p>
            <p className="line-clamp-3">{message.body}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your reply</label>
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              rows={5}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Write your reply…"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setReplyOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={sending} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">
              {sending ? 'Sending…' : 'Send Reply'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MessageDetails;
