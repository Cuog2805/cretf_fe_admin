import React, { useState, useEffect } from 'react';
import { Card, Avatar, Form, Button, Input, Tooltip, Tree, Empty, Spin, message, Popconfirm, Typography } from 'antd';
import { Comment } from '@ant-design/compatible';
import { UserOutlined, MessageOutlined, DeleteOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import { flatToTree } from '@/components/tree/treeUtil';
import { createPropertyComment, deletePropertyComment } from '@/services/apis/propertyController';
import { useCurrentUser } from '@/selectors/useCurrentUser';

const { TextArea } = Input;
const { Text } = Typography

// Type for the editor props
interface EditorProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
}

// Comment editor component
const Editor: React.FC<EditorProps> = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Thêm nhận xét
      </Button>
    </Form.Item>
  </div>
);

const PropertyComment = ({ propertyDetail }: { propertyDetail: API.PropertyDTO | null }) => {
  const currentUser = useCurrentUser();

  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // Load comments when propertyDetail changes
  useEffect(() => {
    setLoading(true);
    if (propertyDetail && propertyDetail.propertyCommentDTOs) {
      const treeComments = flatToTree(
        propertyDetail.propertyCommentDTOs, 
        'code',  
        'parentCode',  
        null
      );
      console.log('treeComments', treeComments)
      setComments(treeComments);
      
      const topLevelKeys = treeComments.map(comment => comment.code);
      setExpandedKeys(topLevelKeys);
    } else {
      setComments([]);
    }
    setLoading(false);
  }, [propertyDetail]);
  
  // const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setValue(e.target.value);
  // };

  // Handle comment submission
  // const handleSubmit = async () => {
  //   if (!value || !propertyDetail) return;

  //   setSubmitting(true);

  //   try {
  //     // Prepare the comment data
  //     const commentData: API.PropertyCommentDTO = {
  //       propertyId: propertyDetail.propertyId,
  //       content: value,
  //       parentCode: replyTo,
  //       creator: currentUser.username,
  //     };
      
  //     // Call the API to create a comment
  //     const response = await createPropertyComment(commentData);
      
  //     if (response && response.data) {
  //       // If the response contains the updated comment data
  //       message.success('Nhận xét đã được thêm thành công!');
        
  //       // Add the new comment to the existing comments
  //       if (propertyDetail.propertyCommentDTOs) {
  //         const updatedDTOs = [...propertyDetail.propertyCommentDTOs, response.data];
  //         propertyDetail.propertyCommentDTOs = updatedDTOs;
          
  //         // Rebuild the tree with flatToTree
  //         const updatedComments = flatToTree(updatedDTOs, 'code', 'parentCode', null);
  //         setComments(updatedComments);
          
  //         // Expand the parent node or new comment
  //         if (replyTo && !expandedKeys.includes(replyTo)) {
  //           setExpandedKeys([...expandedKeys, replyTo]);
  //         } else if (response.data.code) {
  //           setExpandedKeys([...expandedKeys, response.data.code]);
  //         }
  //       }
        
  //       // Clear the input and reset replyTo
  //       setValue('');
  //       setReplyTo(null);
  //     } else {
  //       message.error('Thêm nhận xét không thành công. Vui lòng thử lại sau.');
  //     }
  //   } catch (error) {
  //     console.error('Error creating comment:', error);
  //     message.error('Đã xảy ra lỗi khi thêm nhận xét. Vui lòng thử lại sau.');
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  // Handle comment deletion
  // const handleDelete = async (id: string) => {
  //   try {
  //     setDeleting(id);
      
  //     const response = await deletePropertyComment({ id });
      
  //     if (response) {
  //       message.success('Nhận xét đã được xóa thành công!');
        
  //       if (propertyDetail && propertyDetail.propertyCommentDTOs) {
  //         const findCommentsToRemove = (code: string, comments: API.PropertyCommentDTO[]): string[] => {
  //           const result: string[] = [code];
            
  //           const children = comments.filter(c => c.parentCode === code);
  //           children.forEach(child => {
  //             if (child.code) {
  //               result.push(...findCommentsToRemove(child.code, comments));
  //             }
  //           });
  //           return result;
  //         };
          
  //         const codesToRemove = findCommentsToRemove(id, propertyDetail.propertyCommentDTOs);
          
  //         const updatedDTOs = propertyDetail.propertyCommentDTOs.filter(
  //           comment => comment.code && !codesToRemove.includes(comment.code)
  //         );
          
  //         propertyDetail.propertyCommentDTOs = updatedDTOs;
          
  //         const updatedComments = flatToTree(updatedDTOs, 'code', 'parentCode', null);
  //         setComments(updatedComments);
  //       }
  //     } else {
  //       message.error('Xóa nhận xét không thành công. Vui lòng thử lại sau.');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting comment:', error);
  //     message.error('Đã xảy ra lỗi khi xóa nhận xét. Vui lòng thử lại sau.');
  //   } finally {
  //     setDeleting(null);
  //   }
  // };

  // const handleReply = (code: string) => {
  //   setReplyTo(code);
  //   const element = document.getElementById('comment-form');
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  // const handleCancelReply = () => {
  //   setReplyTo(null);
  // };

  // const isCurrentUserComment = (comment: any) => {
  //   return comment.creator === currentUser.username;
  // };

  return (
    <div
      id="property-details"
      style={{
        paddingTop: '120px',
        marginTop: '-110px',
      }}
    >
      <Card title="Nhận xét">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : comments.length > 0 ? (
          <div className="comments-tree" style={{ marginBottom: 30 }}>
            <Tree
              switcherIcon={<DownOutlined />}
              defaultExpandAll
              fieldNames={{ title: 'creator', key: 'code', children: 'children' }}
              titleRender={(node) => (
                <Comment
                  actions={[
                    // <span key="comment-reply" onClick={() => handleReply(node.code)}>
                    //   <MessageOutlined /> Trả lời
                    // </span>,
                    // isCurrentUserComment(node) && (
                    //   <Popconfirm
                    //     key="comment-delete"
                    //     title="Bạn có chắc chắn muốn xóa nhận xét này?"
                    //     onConfirm={() => handleDelete(node.code)}
                    //     okText="Xóa"
                    //     cancelText="Hủy"
                    //   >
                    //     <span style={{ color: deleting === node.code ? '#d9d9d9' : '#ff4d4f' }}>
                    //       <DeleteOutlined /> {deleting === node.code ? 'Đang xóa...' : 'Xóa'}
                    //     </span>
                    //   </Popconfirm>
                    // )
                  ].filter(Boolean)}
                  author={node.creator === propertyDetail?.creator ? <>{node.creator} - {<Text strong>Chủ sở hữu</Text>}</> : <>{node.creator}</>}
                  avatar={<Avatar icon={<UserOutlined />} />}
                  content={<p>{node.content}</p>}
                  datetime={
                    <Tooltip title={node.dateCreated}>
                      <span>{moment(node.dateCreated).fromNow()}</span>
                    </Tooltip>
                  }
                />
              )}
              treeData={comments}
            />
          </div>
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        )}
        
        {/* Comment form */}
        {/* <div id="comment-form">
          <Comment
            avatar={<Avatar icon={<UserOutlined />} />}
            content={
              <>
                {replyTo && (
                  <div style={{ marginBottom: 10 }}>
                    <span>Đang trả lời nhận xét</span>
                    <Button 
                      size="small" 
                      style={{ marginLeft: 10 }} 
                      onClick={handleCancelReply}
                    >
                      Hủy
                    </Button>
                  </div>
                )}
                <Editor
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  value={value}
                />
              </>
            }
          />
        </div> */}
      </Card>
    </div>
  );
};

export default PropertyComment;