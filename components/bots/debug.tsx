'use client';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import { Message } from 'grammy/types';

import { useEffect, useState } from 'react';
import JSONView from 'react-json-view';

import { useTranslations } from 'next-intl';

import { Messages } from '#/globals';
import { useDebug } from '#/lib/debug';

function parseMessageView(message: Message): {
  type: keyof Messages['Message'];
  content: string;
} {
  if (message.text) {
    return {
      type: 'text',
      content: message.text,
    };
  }
  if (message.caption) {
    return {
      type: 'caption',
      content: message.caption,
    };
  }
  if (message.sticker) {
    return {
      type: 'sticker',
      content: message.sticker.file_id,
    };
  }
  if (message.photo) {
    return {
      type: 'photo',
      content: message.photo[0].file_id,
    };
  }
  if (message.video) {
    return {
      type: 'video',
      content: message.video.file_id,
    };
  }
  if (message.audio) {
    return {
      type: 'audio',
      content: message.audio.file_id,
    };
  }
  if (message.voice) {
    return {
      type: 'voice',
      content: message.voice.file_id,
    };
  }
  if (message.document) {
    return {
      type: 'document',
      content: message.document.file_id,
    };
  }
  return {
    type: 'unknown',
    content: 'Unknown message type',
  };
}

function DebugBot() {
  const t = useTranslations();
  const [selectedMessage, setSelectedMessage] =
    useState<Message | null>(null);
  const { instance, messages, insertMessage } =
    useDebug();

  useEffect(() => {
    instance?.on('message', (ctx) => {
      insertMessage(ctx.message as Message);
    });
  }, [insertMessage, instance]);

  return (
    <>
      <div className="flex h-full w-full overflow-hidden">
        <div className="h-full w-72 border-r bg-background">
          <div className="flex h-full flex-col">
            {messages.length == 0 && (
              <p className="py-4 text-center text-muted-foreground">
                {t('Debug.No messages')}
              </p>
            )}
            <div className="h-full overflow-y-auto">
              <AnimatePresence>
                {messages.map(
                  (message, index) => {
                    const parsedMessage =
                      parseMessageView(message);
                    const isSelected =
                      selectedMessage?.message_id ===
                      message.message_id;
                    return (
                      <div
                        key={message.message_id}
                        className={`h-20 border-b p-4 ${
                          isSelected
                            ? 'bg-primary-foreground'
                            : ''
                        }`}
                        onClick={() =>
                          setSelectedMessage(
                            message,
                          )
                        }
                      >
                        <motion.div
                          initial={{
                            opacity: 0,
                            x: -10,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: 0.5,
                          }}
                        >
                          <p className="text-sm text-muted-foreground">
                            {t(
                              `Message.${parsedMessage.type}` as any,
                            )}
                          </p>
                          <p className="line-clamp-1">
                            {
                              parsedMessage.content
                            }
                          </p>
                        </motion.div>
                      </div>
                    );
                  },
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {selectedMessage ? (
          <div className="flex-1 overflow-auto bg-background p-4">
            <JSONView src={selectedMessage} />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            {t('Debug.No message selected')}
          </div>
        )}
      </div>
    </>
  );
}

export default DebugBot;
