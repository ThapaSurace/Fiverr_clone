const User = [
    { _id: 'user1', name: 'User 1' },
    { _id: 'user2', name: 'User 2' },
    { _id: 'user3', name: 'User 3' },
    // Add more users as needed
  ];

  // Dummy order data
const Order = [
    { _id: 'order1', buyerId: 'user1', gigId: 'gig1' },
    { _id: 'order2', buyerId: 'user1', gigId: 'gig2' },
    { _id: 'order3', buyerId: 'user2', gigId: 'gig1' },
    { _id: 'order4', buyerId: 'user3', gigId: 'gig4' },
    // Add more orders as needed
  ];


  function calculateCosineSimilarity(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length || vectorA.length === 0) {
      return 0; // Cosine similarity is undefined in these cases
    }
  
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
  
    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      magnitudeA += vectorA[i] ** 2;
      magnitudeB += vectorB[i] ** 2;
    }
  
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
  
    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0; // Prevent division by zero
    }
  
    return dotProduct / (magnitudeA * magnitudeB);
  }
  
  
  async function recommendProductsForUser(userId) {
    try {
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        throw new Error('User not found');
      }
  
      // Get the order history of the user
      const userOrderHistory = await Order.find({ buyerId: userId });
  
      // Find all users except the target user
      const users = await User.find({ _id: { $ne: userId } });
      const recommendations = [];
  
      for (const otherUser of users) {
        // Check if the other user has placed any orders
        const otherUserOrderCount = await Order.countDocuments({ buyerId: otherUser._id });
  
        if (otherUserOrderCount === 0) {
          continue; // Skip users who haven't placed any orders
        }
  
        const otherUserOrderHistory = await Order.find({ buyerId: otherUser._id });
  
        // Calculate cosine similarity between the two users based on their order history
        const similarityScore = calculateCosineSimilarity(
          userOrderHistory.map(order => order.gigId),
          otherUserOrderHistory.map(order => order.gigId)
        );
  
        recommendations.push({
          userId: otherUser._id,
          similarityScore,
        });
      }
  
      // Sort recommendations by similarity score (higher score means more similar)
      recommendations.sort((a, b) => b.similarityScore - a.similarityScore);
  
      // Get the top N similar users (e.g., top 5)
      const topSimilarUsers = recommendations.slice(0, 5);
  
      // Collect the products (gigs) ordered by the top similar users
      const recommendedProducts = [];
  
      for (const similarUser of topSimilarUsers) {
        const similarUserOrderHistory = await Order.find({ buyerId: similarUser.userId });
        const orderedProductIds = similarUserOrderHistory.map(order => order.gigId);
  
        // Filter out products already ordered by the target user
        const uniqueOrderedProductIds = orderedProductIds.filter(productId => {
          return !userOrderHistory.some(order => order.gigId === productId);
        });
  
        // Find gig details for recommended product IDs
        const recommendedGigs = await Gig.find({ _id: { $in: uniqueOrderedProductIds } });
  
        recommendedProducts.push({
          user: similarUser.userId,
          similarityScore: similarUser.similarityScore,
          gigs: recommendedGigs,
        });
      }
  
      return recommendedProducts;
  
    } catch (err) {
     console.log(err)
    }
  }
  
  const userId = 'user1';
  const recommendedProducts = recommendProductsForUser(userId);
  console.log('Recommended Products:', recommendedProducts);

console.log(hello)