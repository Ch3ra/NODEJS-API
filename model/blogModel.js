module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define("blog", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subTittle: {
      type: DataTypes.STRING,
      allowNull: false,
      
      

    
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
 
  });
  return Blog;
};