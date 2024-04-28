// App.js
import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import SplashScreen from './components/SplashScreen'; // 导入 SplashScreen 组件

export default function App() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState(null);
  const handleBackToHome = () => {
    setSelectedCategory(null);
    setProducts(null);
  };

  useEffect(() => {
    // SplashScreen 延迟
    const timer = setTimeout(() => {
      setLoading(false);
      fetchCategories();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Fetching categories failed:', error);
    }
  };

  const fetchProductsForCategory = async (category) => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Fetching products failed:', error);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        setSelectedCategory(item);
        fetchProductsForCategory(item);
      }}
    >
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>Price: {item.price}</Text>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return <SplashScreen />;
    } else if (selectedCategory && products) {
      return (
        <>
          {/* 返回按钮 */}
          <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.productList}
          />
        </>
      );
    } else if (!categories) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else {
      return (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.content}
        />
      );
    }
  };
  const renderProductList = () => {
    return (
      <>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productList}
        />
        {/* 返回按钮 */}
        <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </>
    );
  };
  return (
    <View style={styles.container}>
      {renderContent()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    marginTop: 50,
    alignItems: 'center',
  },
  categoryItem: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    position: 'absolute',
    top: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 30,
    paddingBottom: 20,
    color: 'red',
  },
  leftTextContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  leftText: {
    fontSize: 18,
    color: 'green',
  },
  button: {
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'blue',
    top: 350,
  },
  productList: {
    marginTop: 50,
    paddingBottom: 70, // 为返回按钮留出空间
  },
  productItem: {
    flexDirection: 'row',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10
  },
  productTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  productPrice: {
    fontWeight: 'bold',
    color: '#E44D26',
  },
  backButton: {
    position: 'absolute',
    bottom: 20, // 距离底部20单位
    alignSelf: 'center', // 按钮水平居中
    padding: 10,
    backgroundColor: '#f0f0f0', // 按钮背景色
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20, // 圆角
    zIndex: 10, // 确保按钮在最上层
  },
  backButtonText: {
    fontSize: 18,
    color: '#000',
  },
});
