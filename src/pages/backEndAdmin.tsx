import React, { useState, useEffect } from 'react';
import { firestore, collection, doc, setDoc, getDocs, deleteDoc, getDoc } from '../firebase';

// Define a type for category
type Category = {
  id: string;
  name: string;
};

// Define a type for user
type User = {
  isAdmin: boolean;
};

const BackEndAdmins = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUserAdmin, setIsUserAdmin] = useState<boolean | null>(null);

  // Function to check if a user is an admin
  const checkIfUserIsAdmin = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        console.log('Is user admin:', userData.isAdmin);
        setIsUserAdmin(userData.isAdmin);
      } else {
        console.log('No such user!');
        setIsUserAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status: ', error);
      setIsUserAdmin(false);
    }
  };

  // Function to add a category
  const addCategory = async (categoryName: string) => {
    try {
      const newCategoryRef = doc(collection(firestore, 'categories'));
      await setDoc(newCategoryRef, { name: categoryName });
      console.log('Category added successfully!');
      fetchCategories(); // Refresh the list of categories
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  };

  // Function to remove a category by its document ID
  const removeCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(firestore, 'categories', categoryId));
      console.log('Category removed successfully!');
      fetchCategories(); // Refresh the list of categories
    } catch (error) {
      console.error('Error removing category: ', error);
    }
  };

  // Function to fetch all categories
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'categories'));
      const categoriesList: Category[] = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error fetching categories: ', error);
    }
  };

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  
  useEffect(() => {
    checkIfUserIsAdmin('DY3uB1FEdYXU8VnUGZ2EVH0apnn1'); 
  }, []);

  return (
    <div className="admin">
      <h1>Categories</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name}
            <button onClick={() => removeCategory(category.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addCategory('New Category2')}>Add Category</button>
      {isUserAdmin !== null && (
        <p>User admin status: {isUserAdmin ? 'Admin' : 'Not Admin'}</p>
      )}
    </div>
  );
};

export default BackEndAdmins;
