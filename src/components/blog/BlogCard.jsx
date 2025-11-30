import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

/**
 * Component for displaying a blog post card on the blog listing page
 * @param {Object} props
 * @param {Object} props.post - The blog post data
 * @param {number} props.index - Index for animation delay
 */
const BlogCard = ({ post, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card hover className="h-full flex flex-col">
        <Link to={`/blog/${post.id}`} className="block">
          <div className="h-48 w-full overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          
          <div className="p-5 flex-grow flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">{post.date}</span>
              <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                {post.category}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-primary transition-colors">
              {post.title}
            </h3>
            
            <p className="text-gray-600 mb-4 flex-grow">
              {post.excerpt}
            </p>
            
            <div className="flex items-center mt-auto">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img 
                  src={post.authorImage || 'https://via.placeholder.com/40'} 
                  alt={post.author}
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{post.author}</p>
                <p className="text-xs text-gray-500">{post.authorTitle || 'Writer'}</p>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};

export default BlogCard; 