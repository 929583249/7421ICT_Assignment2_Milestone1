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
import { ScrollView } from 'react-native';


export default function App() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState(null);
  const handleBackToHome = () => {
    setSelectedCategory(null);
    setProducts(null);
  };
  const [selectedProduct, setSelectedProduct] = useState(null);
  const Header = ({ title, isLoading }) => (
    <View style={styles.headerContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : (
        <Text style={styles.headerTitle}>{title}</Text>
      )}
    </View>
  );


  useEffect(() => {
    // SplashScreen 延迟
    const timer = setTimeout(() => {
      setLoading(false);
      fetchCategories();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const fetchCategories = async () => {
    setLoading(true); // 在获取分类时开始显示加载状态
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Fetching categories failed:', error);
    } finally {
      setLoading(false); // 无论获取成功与否，都结束加载状态
    }
  };
  const getPageTitle = () => {
    if (selectedCategory && !selectedProduct) {
      return selectedCategory;
    } else if (selectedProduct) {
      return 'Product Details';
    } else {
      return 'Fake Store';
    }
  };
  const fetchProductsForCategory = async (category) => {
    setLoading(true); // 在获取产品时开始显示加载状态
    try {
      const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
      const data = await response.json();
      setProducts(data);
      setSelectedCategory(category);
    } catch (error) {
      console.error('Fetching products failed:', error);
    } finally {
      setLoading(false); // 无论获取成功与否，都结束加载状态
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
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => fetchProductDetails(item.id)}
    >
      <View style={styles.productItem}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>Price: {item.price}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderContent = () => {
    let pageTitle = getPageTitle();
    return (
      <View style={{ flex: 1 }}>
        {/* 传递 loading 状态给 Header 组件 */}
        <Header title={pageTitle} isLoading={loading} />
        {loading && !selectedCategory && !selectedProduct ? (
          <SplashScreen />
        ) : selectedProduct ? (
          renderProductDetails()
        ) : selectedCategory && products ? (
          renderProductList()
        ) : categories ? (
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.content}
          />
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    );
  };
  
  
  
  const renderProductList = () => {
    return (
      <View style={styles.productListContainer}>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          style={styles.productList}
        />
        {/* 固定在底部的返回按钮 */}
        <TouchableOpacity onPress={handleBackToHome} style={styles.fixedBottomButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const fetchProductDetails = async (productId) => {
    setLoading(true); // 在获取产品详情时开始显示加载状态
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
      const data = await response.json();
      setSelectedProduct(data);
    } catch (error) {
      console.error('Fetching product details failed:', error);
    } finally {
      setLoading(false); // 无论获取成功与否，都结束加载状态
    }
  };
  
  
  const renderProductDetails = () => {
    if (!selectedProduct) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    return (
      <View style={styles.productDetailsContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Image source={{ uri: selectedProduct.image }} style={styles.productDetailImage} />
          <Text style={styles.productDetailTitle}>{selectedProduct.title}</Text>
          <Text style={styles.productDetailPrice}>Price: {selectedProduct.price}</Text>
          <Text style={styles.productDetailDescription}>{selectedProduct.description}</Text>
          {/* 添加到购物车按钮 */}
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </ScrollView>
        {/* 返回按钮 */}
        <TouchableOpacity onPress={() => setSelectedProduct(null)} style={styles.fixedBackButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
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
  // backButton: {
  //   position: 'absolute',
  //   bottom: 20, // 距离底部20单位
  //   alignSelf: 'center', // 按钮水平居中
  //   padding: 10,
  //   backgroundColor: '#f0f0f0', // 按钮背景色
  //   borderWidth: 1,
  //   borderColor: '#000',
  //   borderRadius: 20, // 圆角
  //   zIndex: 10, // 确保按钮在最上层
  // },
  backButton: {
    // 不再需要绝对定位
    padding: 10,
    backgroundColor: '#f0f0f0', // 按钮背景色
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20, // 圆角
  },
  backButtonText: {
    fontSize: 18,
    color: '#000',
  },
  productDetails: {
    // 产品详情内容的样式
    alignItems: 'center',
    marginTop: 50, // 或更根据你的设计调整
  },
  productDetailImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  productDetailTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  productDetailPrice: {
    fontSize: 18,
    color: '#E44D26',
  },
  productDetailDescription: {
    textAlign: 'center',
  },
  productDetailButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  addToCartButton: {
    // 添加到购物车按钮样式
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  addToCartButtonText: {
    color: '#fff',
  },
  productDetailsContainer: {
    flex: 1,
     // 使内容和按钮分布在上下两端
  },
  scrollViewContent: {
    alignItems: 'center',
    padding: 20,
  },
  fixedBackButton: {
    padding: 10,
    backgroundColor: '#f0f0f0', // 按钮背景色
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20, // 圆角
    position: 'absolute', // 使用绝对定位将按钮放在底部
    bottom: 20, // 距离底部的位置
    alignSelf: 'center', // 在底部居中
    zIndex: 10, // 确保按钮在最上层
  },
  productListContainer: {
    flex: 1,
    justifyContent: 'space-between', // 用来确保内容和按钮位于容器的两端
  },
  productList: {
    marginTop: 50,
  },
  fixedBottomButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    position: 'absolute', // 绝对定位
    bottom: 20, // 底部间距20
    alignSelf: 'center', // 水平居中
    zIndex: 10, // 确保按钮在最上层
  },
  headerContainer: {
    height: 100, // 根据需要调整高度
    backgroundColor: 'navy', // 标题栏背景颜色
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white', // 标题文字颜色
    fontSize: 20, // 标题文字大小
  },
});
