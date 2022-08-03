---
title: 剑指offer 
date: 2022-7-26
tags: 
- 剑指offer
categories:
- Algorithm
---

## 栈与队列（简单）

- 用两个栈实现队列

```java
//解法一：用LinkedList模拟栈
class CQueue {
    LinkedList<Integer> stack1,stack2; 
    public CQueue() {
        stack1 = new LinkedList<>();
        stack2 = new LinkedList<>();
    }
    
    public void appendTail(int value) {
        stack1.addLast(value);
    }
    
    public int deleteHead() {
        if(!stack2.isEmpty()) return stack2.removeLast();
        if(stack1.isEmpty()) return -1;
        while(!stack1.isEmpty()){
            stack2.addLast(stack1.removeLast());
        }
        return stack2.removeLast();
    }
}
/**
 * Your CQueue object will be instantiated and called as such:
 * CQueue obj = new CQueue();
 * obj.appendTail(value);
 * int param_2 = obj.deleteHead();
 */
//时间复杂度：O(m),m为stack1中存储的元素个数
//空间复杂度：O(n),n为两个栈存储的元素总个数
//堆栈的链式存储
//栈的链式存储结构实际上就是一个单链表，叫做链栈,栈顶的指针top应该在链表的头部，如果在链表的尾部的话，插入操作方便，但是删除操作很麻烦（删除节点后，不知道他的上一个节点在哪里）
//解法二:用遗留的集合Stack
public class AchieveQueueByTwoStack {
    Stack<Integer> a,b;
    public AchieveQueueByTwoStack() {
         a = new Stack<>();
         b = new Stack<>();
    }

    public void appendTail(int value) {
        a.add(value);
    }

    public int deleteHead() {
        //每次删除前要先判断一下栈b是否为空
        if(!b.isEmpty()) return b.pop();
        if(!a.isEmpty()){
            while (!a.isEmpty()){
                b.add(a.pop());
            }
            return b.pop();
        }
        return -1;
    }
}
```

- 包含min函数的栈

```java
//采用辅助栈法
class MinStack {
 Stack<Integer> A,B;
    public MinStack(){
        A=new Stack<>();
        B=new Stack<>();
    }
    public void push(int x){
        A.add(x);
        if(B.empty()||B.peek()>=x){
            B.add(x);
        }
    }
    public void pop(){
        if(A.pop().equals(B.peek())){
            B.pop();
        }
    }
    public int top(){
        return A.peek();
    }
    //保证栈B的顶部始终为栈A中的最小元素
    public int min(){
        return B.peek();
    }
}
//解法二：采用LinkedList模拟栈
class MinStack {

    /** initialize your data structure here. */
    LinkedList<Integer> stack1,stack2;
    public MinStack(){
        stack1 = new LinkedList<>();
        stack2 = new LinkedList<>();
    }
    public void push(int x){
        stack1.add(x);
        if(stack2.isEmpty()||stack2.peekLast()>=x){
            stack2.add(x);
        }
    }
    public void pop(){
        if(stack1.peekLast().equals(stack2.peekLast())){
            stack2.removeLast();
        }
        stack1.removeLast();
    }
    public int top(){
        return stack1.peekLast();
    }

    public int min(){
        return stack2.peekLast();
    }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack obj = new MinStack();
 * obj.push(x);
 * obj.pop();
 * int param_3 = obj.top();
 * int param_4 = obj.min();
 */
//notes:
Integer a =128;
Integer b =128;
System.out.println(a==b);//false
Integer x =127;
Integer y =127;
System.out.println(x == y);//true
```

## 链表（简单）

- 从尾到头打印链表

```java
class Solution {
    public int[] reversePrint(ListNode head) {
        int length=0;
        List<Integer> list=new ArrayList<>();
        if(head==null){
            return new int[0];
        }
        list.add(head.val);
        //求出链表的长度
        while(head!=null){
            head=head.next;
            if(head!=null){
                list.add(head.val);
            }
            length++;
        }
        int[] arr = new int[length];
        int index=length-1;
        for(int i=0;i<list.size();i++){
            arr[index--]=list.get(i);
        }
        return arr;
    }
}
//解法二：辅助栈
    /**
     * 辅助栈
     * @param head
     * @return
     */
    public int[] reversePrint(ListNode head){
        LinkedList<Integer> stack = new LinkedList<>();
        while (head!=null){
            stack.add(head.val);
            head=head.next;
        }
        int[] arr = new int[stack.size()];
        for (int i = 0; i < arr.length; i++) {
            arr[i]=stack.removeLast();
        }
        return arr;
    }
时间复杂度：O(n)，其中n为链表中节点的个数
空间复杂度：O(n)
```

- 反转链表

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
    /**
     * 迭代法(双指针)
     * @param head
     * @return
     */
  public ListNode reverseList(ListNode head){
        ListNode cur = head;
        ListNode pre = null;
        while(cur!=null){
            //把当前节点的下一个节点暂存起来
            ListNode temp = cur.next;
            //当前节点的next指针指向pre节点
            cur.next=pre;
            //更新pre节点
            pre=cur;
            //更新cur节点
            cur=temp;
        }
        return pre;
  }
```

- 复杂链表的复制

```java
/*
// Definition for a Node.
class Node {
    int val;
    Node next;
    Node random;

    public Node(int val) {
        this.val = val;
        this.next = null;
        this.random = null;
    }
}
*/
class Solution {
    public Node copyRandomList(Node head) {
        if(head==null) return null;
        //创建哈希表
        Map<Node,Node> map = new HashMap<>();
        //把当前节点的值赋值给cur
        Node cur = head;
        //哈希表存储(原节点，对应的新节点)
        while(cur!=null){
            map.put(cur,new Node(cur.val));
            cur=cur.next;
        }
        cur=head;
        //构建新链表的next指针和random指针
        while(cur!=null){
            //构建新链表的next指针
            map.get(cur).next=map.get(cur.next);
            //构建新链表的random指针
            map.get(cur).random=map.get(cur.random);
            cur=cur.next;//缺少这行会导致死循环，运行时间超出限制
        }
        return map.get(head);
    }
}
```

## 字符串（简单）

- 替换空格

```java
class Solution {
    public String replaceSpace(String s) {
     StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if(c==' '){
                sb.append("%20");
            }else{
                sb.append(c);   
            }
        }
        return sb.toString();          
    }
}
//s.charAt(i)='122'，报错too many characters in literal charecter，原因是''里面只能放一个字符
//s.charAt(i)='1'，报错Variable expected，原因是s.charAt(i)返回的是一个值，不是一个变量，把值赋给值不合逻辑
//s.charAt(i).equals(' ')，报错，原因是s.charAt(i)返回的是一个值，值没有equals()方法
```

- 左旋转字符串

```java
//解法一：若面试不允许用切片函数，则用此方法
class Solution {
    public String reverseLeftWords(String s, int n) {
        char[] ch = s.toCharArray();
        StringBuilder sb = new StringBuilder();
        for(int i =n;i<ch.length;i++){
            sb.append(ch[i]);
        }
        for(int j=0;j<n;j++){
            sb.append(ch[j]);
        }       
        return sb.toString();
    }
}
//解法二：调用字符串切片函数s.substring(beginIndex(inclusive),enIndex(exclusive))
class Solution {
    public String reverseLeftWords(String s, int n) {
        return s.substring(n,s.length())+s.substring(0,n);
    }
}
//解法三：字符串遍历拼接
class Solution {
    public String reverseLeftWords(String s, int n) {
        String res="";
        for(int i =n;i<s.length();i++){
            res+=s.charAt(i);
        }
        for(int j=0;j<n;j++){
            res+=s.charAt(j);
        }
        return res;
    }
}
```

## 查找算法（简单）

- 数组中重复的数字

```java
//解法一：利用哈希表
class Solution {
    public int findRepeatNumber(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for(int i=0;i<nums.length;i++){
            if(!set.contains(nums[i])){
                set.add(nums[i]);
            }else{
                return nums[i];
            }
        }
        return 0;                            
    }
}
时间复杂度：O(n),n为数组nums的长度
时间复杂度：O(n)
//对解法一代码进行优化
class Solution {
    public int findRepeatNumber(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for(int k:nums){
            if(set.contains(k)) return k;
            set.add(k);
        }
        return 0;                            
    }
}
```

- 在排序数组中查找数字I

```java
//暴力解法
class Solution {
    public int search(int[] nums, int target) {
        int count=0;
        for(int i=0;i<nums.length;i++){
            if(nums[i]==target){
                count++;
            }
        }
        return count;     
    }
}
//二分查找
class Solution {
    public int search(int[] nums, int target) {
        //思想：通过二分查找依次找到target和target-1右边界的索引，然后两者相减即可
        return rightBorder(nums,target)-rightBorder(nums,target-1);
    }
    //查找元素的右边界
    public int rightBorder(int[] arr,int element){
        int left =0;
        int right=arr.length-1;
        while(left<=right){
            int mid=left+(right-left)/2;
            if(arr[mid]<=element){
                left=mid+1;
            }else{
                right=mid-1;
            }
        }
        return left;
    }
}
```

- 0~n-1中缺失的数字

```java
//最优解法是二分解法，时间复杂度为O(logn)
class Solution {
    public int missingNumber(int[] nums) {
        for(int i=0;i<nums.length;i++){
            if(nums[i]!=i){
                return i;
            }
        }
        return nums.length;
    }
}
```

## 查找算法（中等）

- 二维数组中的查找

```java
//解法一：每一层采用二分查找
class Solution {
    public boolean findNumberIn2DArray(int[][] matrix, int target) {
        for(int i=0;i<matrix.length;i++){
            int start=0;
            int end=matrix[0].length-1;
            int mid;
            while(start<=end){
                mid=start+(end-start)/2;
                if(matrix[i][mid]<target){
                    start=mid+1;
                }else if(matrix[i][mid]>target){
                    end=mid-1;
                }else{
                    return true;
                }
            }
        }
        return false;
    }
}
//解法二：取矩阵左下角或者右上角的任意一个数作为标志数flag，得到这个数的下标(i,j)，以右上角的数为flag，如果flag<target就消去flag所在的这一行，即i++，flag变为新矩阵右上角的数;如果flag>target，就消去flag所在的这一列，即j--;如果flag=target就返回true
class Solution {
    public boolean findNumberIn2DArray(int[][] matrix, int target) {
        if(matrix.length==0) return false;
        int i=0;
        int j=matrix[0].length-1;
        while(i<matrix.length&&j>=0){
            if(matrix[i][j]>target){
                j--;
            }else if(matrix[i][j]<target){
                i++;
            }else{
                return true;
            }
        }
        return false;
    }
}
时间复杂度：O(m+n),m和n分别是二维矩阵的行数和列数
空间复杂度：O(1)
```

- 旋转数组的最小数字

```java
class Solution {
    public int minArray(int[] numbers) {
        //解法一：调用API
        // Arrays.sort(numbers);
        // return numbers[0];
        //解法二：暴力解法
        // int minNum=numbers[0];
        // for(int i=0;i<numbers.length;i++){
        //     if(numbers[i]<=minNum){
        //         minNum=numbers[i];
        //     }
        // }
        // return minNum;
        //解法三：二分查找(最优解法)
        int i=0;
        int j=numbers.length-1;
        while(i!=j){
            int mid=i+(j-i)/2;
            if(numbers[mid]<numbers[j]){
                j=mid;
            }else if(numbers[mid]>numbers[j]){
                i=mid+1;
            }else{
                j--;
            }
        }
        return numbers[i];
    }
}
```

- 第一个只出现一次的字符

```java
//解法一：哈希表
class Solution {
    public char firstUniqChar(String s) {
        HashMap<Character,Integer> map = new HashMap<>();
        for(int i=0;i<s.length();i++){
            map.put(s.charAt(i),map.getOrDefault(s.charAt(i),0)+1);
        }
        for(int i=0;i<s.length();i++){
            if(map.get(s.charAt(i))==1){
                return s.charAt(i);
            }
        }
        return ' ';
    }
}
//解法二：有序哈希表，用时23ms
public class FirstUniqChar {
    /**
     * 有序哈希表
     * value中存boolean类型的值，true表明字符只出现一次，false表明字符出现次数超过一次
     * @param s
     * @return
     */
    public char firstUniqChar(String s){
        LinkedHashMap<Character, Boolean> map = new LinkedHashMap<>();
        for(int i=0;i<s.length();i++){
            map.put(s.charAt(i),!map.containsKey(s.charAt(i)));
        }
        for (Map.Entry<Character, Boolean> entry : map.entrySet()) {
            if(entry.getValue()) return entry.getKey();
        }
        return ' ';
    }
}
//优化解法二：用时19ms
public class FirstUniqChar {
    /**
     * 有序哈希表
     * value中存boolean类型的值，true表明字符只出现一次，false表明字符出现次数超过一次
     * @param s
     * @return
     */
    public char firstUniqChar(String s){
        LinkedHashMap<Character, Boolean> map = new LinkedHashMap<>();
        char[] c = s.toCharArray();
        for (char c1 : c) {
            map.put(c1,!map.containsKey(c1));
        }
        for (Map.Entry<Character, Boolean> entry : map.entrySet()) {
            if(entry.getValue()) return entry.getKey();
        }
        return ' ';
    }
}
//A map entry即key-value pair
//Entry是Map接口内部的一个接口
```

## 搜索与回溯算法（简单）

- 从上到下打印二叉树

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
//解法一：采用bfs
class Solution {
    public int[] levelOrder(TreeNode root) {
        if(root==null) return new int[0];
        LinkedList<TreeNode> queue = new LinkedList<>();
        queue.add(root);//等价于queue.offer(root)
        List<Integer> list = new ArrayList<>();
        //关键：队列弹出元素的同时把该元素的左右结点加入到队列中
        while(queue.size()>0){
            TreeNode node = queue.removeFirst();
            list.add(node.val);//不用判断node是否为空，因为下面已经做了判断，保证queue.add()加进来的不为空
            if(node.left!=null){
                queue.add(node.left);
            }
            if(node.right!=null){
                queue.add(node.right);
            }
        }
        int[] array = new int[list.size()];
        int index=0;
        for(int k:list){
            array[index++]=k;
        }
        return array;
    }
}
//new Queue<>()报错，原因是Queue为接口，不能实例化
//notes:LinkedList里面的null值也算长度
LinkedList<TreeNode> list = new LinkedList<>();
list.add(null);
list.add(null);
System.out.println(list.size());//2
System.out.println(list.isEmpty());//false
```

- 从上到下打印二叉树II:每一层打印一行

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
//bfs
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if(root==null) return res;
        LinkedList<TreeNode> queue = new LinkedList<>();
        queue.add(root);//等价于queue.offer(root)
        while(queue.size()>0){
            List<Integer> list = new ArrayList<>();
            int size = queue.size();
            //关键：循环的次数是根据当前队列的元素个数决定的
            for(int i=0;i<size;i++){
                TreeNode node = queue.removeFirst();
                list.add(node.val);
                if(node.left!=null){
                    queue.add(node.left);
                }
                if(node.right!=null){
                    queue.add(node.right);
                }
            }
            res.add(list);
        }
        return res; 
    }
}
```

- 从上到下打印二叉树III:按照之字形打印

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
//解法一：层序遍历+倒序
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        //判断根节点是否为空
        if(root==null) return res;
        //模拟队列
        LinkedList<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while(!queue.isEmpty()){
            List<Integer> list = new ArrayList<>();
                for (int i = queue.size(); i >0; i--) {
                    TreeNode node = queue.removeFirst();
                    list.add(node.val);
                    if(node.left!=null) queue.add(node.left);
                    if(node.right!=null) queue.add(node.right);
                }
            //res.size()%2==1表明当前层是偶数层，不熟悉Collections.reverse()API
                if(res.size()%2==1) Collections.reverse(list);
                res.add(list);
        }
        return res;
    }
}
//解法二：层序遍历+双端队列
/**
 * @author yhli3
 * @classname PrintBinaryTree3
 * @Date 2021/11/30 16:24
 */
public class PrintBinaryTree3 {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        //判断根节点是否为空
        if(root==null) return res;
        //模拟队列
        LinkedList<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while(!queue.isEmpty()){
            LinkedList<Integer> deque = new LinkedList<>();
            for (int i = queue.size(); i >0; i--) {
                    TreeNode node = queue.removeFirst();
                    if(res.size()%2==0) deque.addLast(node.val);//当前层是奇数层，应该把元素放到队列尾部
                    else deque.addFirst(node.val); //当前层是偶数层，应该把元素放到队列前面
                    if(node.left!=null) queue.add(node.left);
                    if(node.right!=null) queue.add(node.right);
                }
                res.add(deque);
        }
        return res;
    }
}
```

- 树的子结构

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    //在树A中找出与树B根节点相同的节点
    public boolean isSubStructure(TreeNode A, TreeNode B) {
        if(A==null||B==null) return false;
        if(A.val==B.val&&recursion(A.left,B.left)&&recursion(A.right,B.right)) return true;
        return isSubStructure(A.left,B)||isSubStructure(A.right,B);
    }
    //判断树A中是否包含树B
    boolean recursion(TreeNode A, TreeNode B) {
        if(B==null) return true;
        if(A==null||A.val!=B.val) return false;
        return recursion(A.left,B.left)&&recursion(A.right,B.right);
    }
}
```

- 二叉树的镜像

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
//递归解法
class Solution {
    public TreeNode mirrorTree(TreeNode root) {
        //递归终止条件
        if(root==null) return null;
        //暂存当前节点的左子节点
        TreeNode temp = root.left;
        root.left=mirrorTree(root.right);
        root.right=mirrorTree(temp);
        return root;
    }
}
时间复杂度：O(n),n为二叉树的节点数量
空间复杂度：O(n)(当二叉树退化为链表)
//解法二：
    /**
     * 辅助栈
     * @param root
     * @return
     */
    public TreeNode mirrorTree(TreeNode root) {
        Stack<TreeNode> stack = new Stack<>();
        //要判断root是否为空
        if(root!=null) stack.push(root);
        while(!stack.isEmpty()){
            TreeNode pop = stack.pop();
            if(pop.left!=null) stack.push(pop.left);
            if(pop.right!=null) stack.push(pop.right);
            TreeNode temp = pop.left;
            pop.left=pop.right;
            pop.right=temp;
        }
        return root;
    }
//解法三：使用双大括号初始化
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public TreeNode mirrorTree(TreeNode root) {
        if(root==null) return null;
        Stack<TreeNode> stack = new Stack<TreeNode>(){{push(root);}};
        while(!stack.isEmpty()){
            TreeNode pop = stack.pop();
            if(pop.left!=null) stack.push(pop.left);
            if(pop.right!=null) stack.push(pop.right);
            TreeNode temp = pop.left;
            pop.left=pop.right;
            pop.right=temp;
        }
        return root;
    }
}
```

- 对称的二叉树

```java
//错误解答
//对递归的理解还是没到位
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public boolean isSymmetric(TreeNode root) {
        if(root==null) return true;
        return recursion(root.left,root.right);
    }

    public boolean recursion(TreeNode left,TreeNode right){
        if(left==null&&right==null) return true;
        if(left==null||right==null) return false;
        if(left.val!=right.val) return false;
        //报空指针
        if(left.left.val!=right.right.val) return false;
        if(left.right.val!=right.left.val) return false;
        return recursion(left.left,right.right)&&recursion(left.right,right.left);
    }
}
//正确的解法：
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public boolean isSymmetric(TreeNode root) {
        //if(root==null) return true;
        //return recursion(root.left,root.right);
        //三目运算符用得很巧妙
        return root==null?true:recursion(root.left,root.right); 
    }

    public boolean recursion(TreeNode left,TreeNode right){
        if(left==null&&right==null) return true;
        if(left==null||right==null||left.val!=right.val) return false;
        return recursion(left.left,right.right)&&recursion(left.right,right.left);
    }
}
```

## 动态规划（简单）

- 斐波那契数列

```java
package com.li.leetcode.Offer;

/**
 * @author yhli3
 * @classname Fibonacci
 * @Date 2021/12/6 9:35
 */
//倒序思想：f(2)=f(0)+f(1),f(3)=f(1)+f(2),.....f(n)=f(n-1)+f(n-2)
public class Fibonacci {
    public int fib(int n) {
        if(n<=1){
            return n;
        }
        int a= 0;
        int b = 1;
        int sum =0;
        for (int i = 2; i <=n; i++) {
            sum=(a+b)%1000000007;
            a=b;
            b=sum;
        }
        return sum;
    }
}
时间复杂度：O(n)
空间复杂度：O(1)
//递归解法会超时
   public int fib(int n){
    if(n<=1) return n;
    return fib(n-1)+fib(n-2);
}
```

- 青蛙跳台阶问题

```java
class Solution {
    public int numWays(int n) {
        if(n==2||n==1) return n;
        else if(n==0) return 1;
        int sum=0;
        int a = 2;
        int b = 1;
        for (int i = 3; i <= n; i++) {
            //1000000007是最小的10位质数，可以保证sum值永远在int范围内
            sum=(a+b)%1000000007;
            b=a;
            a=sum;
        }
        return sum;
    }
}
//质数又称为素数，指的是只有1和本身两个正因数
```

- 股票的最大利润

```java
class Solution {
    //前i天最大利润=max(前i-1日最大利润，第i日价格-前i日最低价格);
    public int maxProfit(int[] prices) {
        int cost=Integer.MAX_VALUE;
        //第0天利润为0
        int profit = 0;
        for(int price:prices){
            //cost为前i日最低价格
            cost=Math.min(cost,price);
            //profit为利润
            profit=Math.max(profit,price-cost);
        }
        return profit;
    }
}
时间复杂度:O(n),n为prices数组的长度
空间复杂度：O(1)
```

## 动态规划（中等）

- 连续子数组的最大和

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int res = nums[0];
        for (int i = 1; i < nums.length; i++) {
            nums[i]=nums[i]+Math.max(nums[i-1],0);
            res=Math.max(res,nums[i]);
        }
        return res;
    }
}
```

- 礼物的最大价值

```java
//解法一
class Solution {
    public int maxValue(int[][] grid) {
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if(i==0&&j==0) continue;
                if(i==0) grid[i][j]+=grid[i][j-1];
                else if(j==0) grid[i][j]+=grid[i-1][j];
                else grid[i][j]+=Math.max(grid[i-1][j],grid[i][j-1]);
            }
        }
        return grid[grid.length-1][grid[0].length-1];
    }
}
//在解法一的基础上优化：如果m和n很大，出现第0行或者第0列的次数很少；如果没有在第0行或者第0列，解法一中每一轮循环都要判断前三个条件，会导致算法效率j
class Solution {
    public int maxValue(int[][] grid) {
       int m = grid.length;
        int n = grid[0].length;
        //初始化第一行
        for (int j = 1; j < n; j++) {
            grid[0][j]+=grid[0][j-1];
        }
        //初始化第一列
        for (int i = 1; i < m; i++) {
            grid[i][0]+=grid[i-1][0];
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
               grid[i][j]+=Math.max(grid[i-1][j],grid[i][j-1]);
            }
        }
        return grid[m-1][n-1];
    }
}
```

- 把数字翻译成字符串

```java
class Solution {
    public int translateNum(int num) {
        String s = String.valueOf(num);
        //使用dp命m，代码的可读性提高
        int[] dp = new int[s.length() + 1];
        dp[0]=1;
        dp[1]=1;
        for (int i = 2; i <=s.length(); i++) {
            String temp = s.substring(i - 2, i);
            if(temp.compareTo("10")>=0&&temp.compareTo("25")<=0){
                dp[i]= dp[i-1]+dp[i-2];
            }else{
                dp[i] = dp[i-1];
            }
        }
        return dp[s.length()];
    }
}
```

- 最长不含重复字符的子字符串

```java
//动态规划（理解思想，掌握常规解法）
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character,Integer> map = new HashMap<>();
        int res =0;
        int tmp =0;
        for(int j=0;j<s.length();j++){
            int i=map.getOrDefault(s.charAt(j),-1);
            map.put(s.charAt(j),j);
            tmp=tmp<j-i?tmp+1:j-i;
            res=Math.max(res,tmp);
        }
        return res;
    }
}
```

## 双指针（简单）

- 删除链表的节点

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode deleteNode(ListNode head, int val) {
        if(head==null) return null;
        ListNode pre = head;
        ListNode cur = head.next;
        if(head.val==val) return head.next;
        while(cur!=null){
            if(cur.val==val){
                pre.next=cur.next;
                return head;
            }
            pre=cur;
            cur=cur.next;
        }
        return head;
    }
}
时间复杂度：O(n),n为链表的结点数量
空间复杂度：O(1)
```

- 链表中倒数第k个节点

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
//设链表长度为length,倒数第k个节点，即正数第length-k+1个节点
class Solution {
    public ListNode getKthFromEnd(ListNode head, int k) {
        int length =0;
        ListNode cur = head;
        while(head!=null){
            length++;
            head=head.next;
        }
        for(int i=0;i<length-k;i++){
            cur=cur.next;
        }
        return cur;
    }
}
```

- 合并两个排序的链表

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
//双指针解法
class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        if(l1==null) return l2;
        if(l2==null) return l1;
        ListNode dummy = new ListNode(0);//没想到创建一个哨兵节点
        ListNode node = dummy;
        while(l1!=null&&l2!=null){
            if(l1.val<=l2.val){
                node.next=l1;
                node=node.next;
                l1=l1.next;
            }else{
                node.next=l2;
                node=node.next;
                l2=l2.next;
            }
        }
        //if(l1==null) node.next=l2;
        //if(l2==null) node.next=l1;
        node.next=l1==null?l2:l1;//优先级：算术运算符>关系运算符>赋值运算符
        return dummy.next;
    }
}                                                    
```

- 两个链表的第一个公共节点

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        int lenA = 0;
        int lenB = 0;
        ListNode nodeA = headA;
        ListNode nodeB = headB;
        while(headA!=null){
            lenA++;
            headA=headA.next;
        }
        while(headB!=null){
            lenB++;
            headB=headB.next;
        }
        //比较两个链表的长度，长的链表的指针先走|lenA-lenB|步
        if(lenA>lenB){
            for(int i=0;i<lenA-lenB;i++){
                nodeA=nodeA.next;
            }
        }else if(lenA<lenB){
              for(int i=0;i<lenB-lenA;i++){
                nodeB=nodeB.next;
            }
        }
        //nodeA==nodeB:说明nodeA和nodeB管理同一个节点,nodeA和nodeB后面的节点都一样
        while(nodeA!=nodeB){
            nodeA=nodeA.next;
            nodeB=nodeB.next;
        }
        return nodeA;
    }
}
```

- 调整数组顺序使得奇数位于偶数前面

```java
//解法一：
class Solution {
    public int[] exchange(int[] nums) {
        int begin = 0;
        int end = nums.length-1;
        int[] array = new int[nums.length];//引入空间消耗
        for(int i=0;i<nums.length;i++){
            //公式：被除数小于除数，那么余数为被除数本身，例如0%2=0，1%2=1
            if(nums[i]%2==1){
                array[begin++]=nums[i];
            }else{
                array[end--]=nums[i];
            }
        }
        return array;
    }
}
//解法二：相比解法一的空间复杂度O(n)，解法二的空间复杂度降到了O(1)
class Solution {
    public int[] exchange(int[] nums) {
        int i =0;
        int j =nums.length-1;
        int temp;
        while(i<j){
            //i指针寻找偶数，当遇到奇数的时候执行i++
            while(i<j&&nums[i]%2==1) i++;
            //j指针寻找奇数，当遇到偶数的时候执行j--
            while(i<j&&nums[j]%2==0) j--;
            //交换i和j指针所指向的值
            temp =nums[i];
            nums[i++]=nums[j];
            nums[j--]=temp;
        }
        return nums;
    }
}
```

- 和为s的两个数字

```java
//解法一
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Set<Integer> set = new HashSet<>();
        for(int i=0;i<nums.length;i++){
            set.add(nums[i]);
        }
         for(int i=0;i<nums.length;i++){
            if(set.contains(target-nums[i])){
                return new int[]{nums[i],target-nums[i]};
            }
        }
        return new int[0];
    }
}
//解法二：采用双指针（最优解法）
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int i=0;
        int j=nums.length-1;
        while(i<=j){
            if(nums[i]+nums[j]<target){
                i++;
            }else if(nums[i]+nums[j]>target){
                j--;
            }else{
                return new int[]{nums[i],nums[j]};
            }
        } 
        return new int[]{};
    }
}
```

- 翻转单词顺序

```java
//解法一(耗时13ms)：
class Solution {
    public String reverseWords(String s) {
        //s.trim()去掉字符串s前面和后面的空格
        //s.split("\\s+")，将字符串s按照正则表达式"\\+s"(匹配一个或多个空格)切割成字符数组
        String[] array = s.trim().split("\\s+");
        String str = "";
        for(int i=array.length-1;i>=0;i--){
            if(i!=0){
                str+=array[i]+" ";
            }else{
                str+=array[i];
            }
        }
        return str;
    }
}
//解法一的优化版（耗时6ms）：
class Solution {
    public String reverseWords(String s) {
        String[] array = s.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for(int i=array.length-1;i>=0;i--){
            sb.append(array[i]+" ");
        }
        return sb.toString().trim();
    }
}
//解法二（耗时3）：
class Solution {
    public String reverseWords(String s) {
        //去掉字符串s的前导和后导空格
        s.trim();
        //初始化i、j双指针
        int i=s.length()-1;
        int j=s.length()-1;
        //构建StringBuilder类处理字符串
        StringBuilder sb = new StringBuilder();
        boolean flag = true;
        while(i>=0){
            if(flag&&(s.charAt(i)==' '||i==0)){
                if(i!=0){
                    sb.append(s.substring(i+1,j+1)+" ");
                }else {
                    sb.append(s.substring(i,j+1)+" ");
                }
                if(i!=0) flag=false;
            }
            if(!flag&&s.charAt(i)!=' '){
                j=i;
                if(i==0&&j==0) sb.append(s.substring(i,j+1)+" ");
                flag=true;
            }
            i--;
        }
        return sb.toString().trim();
    }
}
```

## 搜索与回溯算法（中等）

- 矩阵中的路径

```java
class Solution {
   public static boolean exist(char[][] board, String word) {
        for(int i=0;i<board.length;i++){
            for(int j=0;j<board[i].length;j++){
                if(dfs(board,word,i,j,0)) return true;
            }
        }
        return false;
    }

    public static boolean dfs(char[][] board,String word,int i,int j,int k){
        //下面if条件语句中的i<0||j<0要放到前面，不然会报数组越界的错误
        if(i<0||j<0||i>=board.length||j>=board[i].length||board[i][j]!=word.charAt(k)){
            return false;
        }
        board[i][j]='1';//匹配好的字符标记为'1'，防止重复搜索
        if(k==word.length()-1) return true;
        boolean res = dfs(board,word,i,j+1,k+1)||dfs(board,word,i+1,j,k+1)||dfs(board,word,i,j-1,k+1)||dfs(board,word,i-1,j,k+1);
        board[i][j] = word.charAt(k);//回溯，每轮循环把标记的字符依次还原，以便下次循环的时候board二维数组是原数组
        return res;
    }
}
```

- 机器人的运动范围

```java
/**
 * @author yhli3
 * @classname MovedRobot
 * @Date 2021/12/23 10:06
 */
public class MovedRobot {
    public static int movingCount(int m, int n, int k) {
        //创建方向数组（巧妙）
        int[] di ={1,0};
        int[] dj ={0,1};
        //创建二维数组,true代表已访问
        boolean[][] visit = new boolean[m][n];
        visit[0][0]=true;
        //初始化队列
        LinkedList<int[]> queue = new LinkedList<int[]>(){{offer(new int[]{0,0});}};
        //count代表机器人走的格子数量
        int count =1;
        while(!queue.isEmpty()){
            int[] cell = queue.poll();
            int x =cell[0];
            int y =cell[1];
            for(int t = 0; t < 2; t++) {
               int i =di[t]+x;
               int j =dj[t]+y;
               //if条件语句中不要忘了添加visit[i][j]这个条件
               if(i<0||j<0||i>=m||j>=n||visit[i][j]||sum(i)+sum(j)>k){
                   continue;
               }
               visit[i][j]=true;
               queue.offer(new int[]{i,j});
               count++;
            }
        }
        return count;
    }

    /**
     * 求位数之和
     * @param x
     * @return
     */
    public static int sum(int x){
        int sum=0;
        while(x!=0){
            sum+=x%10;
            x/=10;
        }
        return sum;
    }

}
```

- 二叉树中和为某一值的路径

```java
    List<List<Integer>> list = new ArrayList<>();
    LinkedList<Integer> path = new LinkedList<>();
    public List<List<Integer>> pathSum(TreeNode root, int target) {
        recusive(root,target);
        return list;
    }

    /**
     * 1.递归的返回类型也可以为void
     * @param root
     * @param target
     */
    public void recusive(TreeNode root,int target){
        //递归的结束条件
        if(root==null) return;
        path.add(root.val);
        target-=root.val;
        if(target==0&&root.left==null&&root.right==null){
            list.add(new LinkedList<>(path));
        }
        recusive(root.left,target);
        recusive(root.right,target);
        path.removeLast();
    }
```

- 二叉搜索树与双向链表

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public Node left;
    public Node right;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val,Node _left,Node _right) {
        val = _val;
        left = _left;
        right = _right;
    }
};
*/
class Solution {
    Node pre,head;
    public Node treeToDoublyList(Node root) {
        if(root==null) return null;
        dfs(root);
        head.left=pre;
        pre.right=head;
        return head;
    }
    //关键：二叉搜索树的中序遍历是递增序列
    void dfs(Node cur){
        if(cur==null) return;
        dfs(cur.left);
        if(pre!=null) pre.right=cur;
        else head=cur;
        cur.left=pre;
        pre=cur;
        dfs(cur.right);
    }
}
时间复杂度：O(N)，N为二叉树的节点数量
空间复杂度：O(N)（二叉搜索树退化为链表的时候）
```

- 二叉搜索树的第K大节点

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
//二叉搜索树的中序遍历为递增序列
class Solution {
    List<Integer> list = new ArrayList<>();
    public int kthLargest(TreeNode root, int k) {
        if(root==null) return 0;
        dfs(root);
        return list.get(list.size()-k);
    }

    public void dfs(TreeNode root){
        if(root==null) return;
        dfs(root.left);
        list.add(root.val);
        dfs(root.right);
    }
}
//第二种解法的思路：二叉搜索树中序遍历的倒序遍历为递减序列
```

- I-二叉树的深度

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
//递归解法
class Solution {
    public int maxDepth(TreeNode root) {
        return postOrderTraversal(root);
    }
    //关键：二叉树的深度=max(左子树的深度，右子树的深度)+1
    public int postOrderTraversal(TreeNode root){
        if(root==null) return 0;
        int left = postOrderTraversal(root.left);
        int right = postOrderTraversal(root.right);
        return Math.max(left,right)+1;
    }
}
//先序遍历：PreOrderTraversal
//中序遍历：InOrderTraversal
//后序遍历：PostOrderTraversal
```

- II-平衡二叉树

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
//后序遍历+剪枝
class Solution {
    public boolean isBalanced(TreeNode root) {
        return postOrderTraversal(root)!=-1;
    }
    public int postOrderTraversal(TreeNode root){
        if(root==null) return 0;
        int left = postOrderTraversal(root.left);
        if(left==-1) return -1;
        int right = postOrderTraversal(root.right);
        if(right==-1) return -1;
        return Math.abs(left-right)<=1?Math.max(left,right)+1:-1;
    }
}
```

- 求1+2+3+...+n(要求不能使用乘除法、for、while、if、else、switch、case等关键字及条件判断语句（A?B:C）)

```java
class Solution {
    int res =0;
    public int sumNums(int n) {
        boolean flag = n>1&&sumNums(n-1)>0;
        res+=n;
        return res;
    }
}
```

- I.二叉搜索树的最近公共祖先

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        //1.如果p,q在root节点的两侧或p,q节点和root节点为同一个节点，那么root为p,q的最近公共祖先
        //2.如果p,q在root节点的右侧，递归root的右子树
        //3.如果p,q在root节点的左侧，递归root的左子树
        if(p.val>root.val&&q.val>root.val){
            return lowestCommonAncestor(root.right,p,q);
        }
        if(p.val<root.val&&q.val<root.val){
            return lowestCommonAncestor(root.left,p,q);
        }
        return root;
    }
}
```

- II. 二叉树的最近公共祖先

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if(root==null||root==p||root==q) return root;
        TreeNode left = lowestCommonAncestor(root.left,p,q);
        TreeNode right = lowestCommonAncestor(root.right,p,q);
        if(left==null&&right==null) return null;
        if(left==null) return right;
        if(right==null) return left;
        //if(left!=null&&right!=null)
        return root;
    }
}
```

## 排序（简单）

- 把数组排成最小的数

```java
class Solution {
    //关键：x+y>y+x,推出x“>”y，x应该排在y后面，即yx
    //x+y<y+x,推出x“<”y，x应该排在y前面，即xy
    public String minNumber(int[] nums) {
        //创建一个字符串数组
        String[] str = new String[nums.length];
        //将数组中的元素变为字符串，并保存在str中
        for(int i=0;i<nums.length;i++){
            str[i]=String.valueOf(nums[i]); 
        }
        quickSort(str,0,str.length-1);
        StringBuilder sb = new StringBuilder();
        for(String s:str){
            sb.append(s);
        }
        return sb.toString();
    }
    public void quickSort(String[] str,int start,int end){
        if(start>=end) return;
        //拿到主元的下标
        int pivot = part(str,start,end);
        quickSort(str,start,pivot-1);
        quickSort(str,pivot+1,end);
    }
    //划分数组，把比主元大的数放主元的右边，比主元小的数放主元左边，函数返回主元的下标
    public int part(String[] str,int start,int end){
        //选取第一个元素作为主元
        String pivot = str[start];
        int left = start+1;
        int right = end;
        while(left<right){
            //找到第一个比pivot“大”的元素的下标
            while(left<right&&(str[left]+pivot).compareTo(pivot+str[left])<=0) left++;
            if(left!=right){
                swap(str,left,right);
                right--;
            }
        }
        //针对数组中只有最后一个数比pivot大，需要重新在判断一下
        if(left==right&&(str[right]+pivot).compareTo(pivot+str[right])>0) right--;
        if(right!=start) swap(str,start,right);
        return right;
    }
    //交换两个数
    public void swap(String[] str,int i,int j){
        String temp = str[i];
        str[i] = str[j];
        str[j] = temp;
    }
    
}
```

- 扑克牌中的顺子

```java
class Solution {
    //关键：max-min<5
    public boolean isStraight(int[] nums) {
        HashSet<Integer> set = new HashSet<>();
        int max =0;
        int min = 14;
        for(int k:nums){
            //过滤掉最大值和最小值
            if(k==0) continue;
            //找到最大值
            max=Math.max(max,k);
            //找到最小值
            min=Math.min(min,k);
            if(set.contains(k)) return false;
            set.add(k);
        }
        return max-min<5;
    }
}
```

## 排序（中等）

- 最小的k个数

```java
class Solution {
    public int[] getLeastNumbers(int[] arr, int k) {
        Arrays.sort(arr);
        int[] res = new int[k];
        for(int i=0;i<k;i++){
            res[i]=arr[i];
        }
        return res;
    }
}
```

- 数据流中的中位数(困难)

```java
//超时解法
class MedianFinder {
    int[] array = new int[50001];
    int index=0;
    int[] res;
    /** initialize your data structure here. */
    public MedianFinder() {

    }
    
    public void addNum(int num) {
        array[index++]=num;
    }
    
    public double findMedian() {
        res=Arrays.copyOfRange(array,0,index);
        //对数组排序
        Arrays.sort(res);
        int len = res.length;
        if(len%2==1){
            return res[len/2];
        }else{
            return (res[len/2]+res[len/2-1])/2.0;
        }
    }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * MedianFinder obj = new MedianFinder();
 * obj.addNum(num);
 * double param_2 = obj.findMedian();
 */
//使用优先队列
class MedianFinder {
    //堆顶元素为最小的那个元素（如果用数组模拟，即为数组的第一个元素）
    Queue<Integer> A = new PriorityQueue<>();
     //堆顶元素为最大的那个元素
    Queue<Integer> B = new PriorityQueue<>((x,y)->(y-x));
    /** initialize your data structure here. */
    public MedianFinder() {

    }
    
    public void addNum(int num) {
        if(A.size()!=B.size()){
            A.add(num);//不会对所有的元素进行排序，但会保证最小的元素在数组最左边
            B.add(A.poll());
        }else{
            B.add(num);
            A.add(B.poll());
        }
    }
    
    public double findMedian() {
        return A.size()!=B.size()?A.peek():(A.peek()+B.peek())/2.0;
    }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * MedianFinder obj = new MedianFinder();
 * obj.addNum(num);
 * double param_2 = obj.findMedian();
 */
```

## 分治算法（中等）

- 重建二叉树

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    int[] preorder;
    HashMap<Integer,Integer> dic = new HashMap<>();
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        this.preorder=preorder;
        for(int i=0;i<inorder.length;i++){
            dic.put(inorder[i],i);
        }
        return recursive(0,0,inorder.length-1);
    }
    //构建递归函数,root代表根节点在前序遍历中的索引，left代表子树在中序遍历的左边界，right代表子树在中序遍历的右边界
    public TreeNode recursive(int root,int left,int right){
        //递归结束条件
        if(left>right) return null;
        //构建根节点
        TreeNode node = new TreeNode(preorder[root]);
        //i表示根节点在中序遍历的索引
        int i = dic.get(preorder[root]);
        //开启左子树递归
        node.left=recursive(root+1,left,i-1);
        //递归右子树
        node.right=recursive(root+i-left+1,i+1,right);
        return node;
    }
}
```

- 数值的整数次方

```java
class Solution {
    public double myPow(double x, int n) {
        if(x==0) return 0;
        long b = n;//避免当b=-2^31时，执行b=-b=2^31发生溢出的场景
        double res =1.0;
        if(b<0){
            x=1/x;
            b=-b;
        }
        while(b>0){
            if(b%2==1) res*=x;//等价于if((b&1)==1) res*=x;
            x=x*x;
            b=b/2; //等价于 b>>=1;
        }
        return res;
    }
}
```

- 二叉搜索树的后序遍历序列

```java
class Solution {
    public boolean verifyPostorder(int[] postorder) {
        return recursion(postorder,0,postorder.length-1);
    }
    public boolean recursion(int[] array,int begin,int end){
        if(begin>=end) return true;//如果改成if(begin==end) return true;则会发生数组索引越界的w
        int index = begin;
        //在数组中从左往右找到第一个大于等于根节点的值的元素
        while(array[index]<array[end]) index++;
        int temp =index;
        while(array[index]>array[end]) index++;
        return index==end&&recursion(array,begin,temp-1)&&recursion(array,temp,end-1);
    }
}
```

## 位运算（简单）

- 二进制中1的个数

```java
public class Solution {
    // you need to treat n as an unsigned value
    public int hammingWeight(int n) {
        int count =0;
        while(n!=0){
            if((n&1)==1){
                count++;
            }
            n>>>=1;//java中三个大于符号，即“>>>”是无符号右移符
        }
        return count;
    }
}
//基础知识：
与运算（符号：&）公式：
    若n&1=0,则二进制n最右一位为0
    若n&1=1,则二进制n最右一位为1
有符号数：二进制中的最高位用来表示符号位（1代表负数，0代表正数）
无符号数：全部二进制位均表示数值位，相当于数的绝对值
高位：二进制中左边的位是高位，例如二进制1110的最高位是1
低位：二进制中右边的位是低位，例如二进制1110的最低位是0
移位操作（以int类型（32位）为例）：
    左移：按二进制形式把所有的数字向左移动对应的位数，如果位数超过32位了，则高位移出，低位的空位补零
    例如，1110<<2(二进制数1110（十进制14）向左移动2位)结果为：111000
    右移：按二进制形式把所有的数字向右移动对应的位数，低位移出，高位的空位补符号位，即正数补0，负数补1
    例如，将10的二进制1010向右移动2位，结果为0010
    无符号右移：按二进制形式把所有的数字向右移动对应的位数，低位移出，高位的空位补0
a>>1相当于a/2（前提是a不是负奇数，例如如果a为-11，a>>1结果为-6（向下取整），a/2=-5（向零取整））
a<<1相当于a*2
```

- 不用加减乘除做加法

```java
class Solution {
    public int add(int a, int b) {
        //a+b=非进位和+进位
        //非进位和等价于异或运算
        int sum = a^b;
        //进位等价于与运算+左移1位
        int carry = (a&b)<<1;
        while(carry!=0){
            a=sum;
            b=carry;
            sum=a^b;
            carry=(a&b)<<1;
        }
        return sum;
    }
}
```

## 位运算（中等）

- I-数组中数字出现的次数

```java
class Solution {
    public int[] singleNumbers(int[] nums) {
        int res=0;
        int a =0;
        int b =0;
        int t = 1;
        //对数组nums所有元素求异或
        for(int k:nums){
            res^=k;
        }
        //从res的右边开始计数，得到res的首位1是第几位
        while((t&res)==0){// while(t&res==0)会报错，原因是res==0优先级高于t&r
            t<<=1;
        }
        //划分数组nums为两个子数组
        for(int e:nums){
            if((t&e)==0){
                a^=e;
            }else{
                b^=e;
            }
        }
        return new int[]{a,b};
    }
}
```

- Ⅱ-数组中数字出现的次数

```java
class Solution {
    public int singleNumber(int[] nums) {
        //1.创建一个容纳32位的数组
        int[] array = new int[32];
        //2.统计nums数组中每一个元素所对应的各二进制位中数字1出现的次数
        for(int k:nums){
            for(int i=0;i<array.length;i++){
                array[i]+=k&1;
                k>>>=1;
            }
        }
        //3.通过左移一位和对3求余数得到结果
        int res =0;
        int m =3;
        for(int j=0;j<array.length;j++){
            res<<=1;
            res|=array[31-j]%m;
        }
        return res;
    }
}
```

## 数学（简单）

- 数组中出现次数超过一半的数字

方法一：哈希表

```java
class Solution {
    public int majorityElement(int[] nums) {
        Map<Integer,Integer> map = new HashMap<>();
        for(int e:nums){
            map.put(e,map.getOrDefault(e,0)+1);
            // if(!map.containsKey(e)){

            // }
        }
        for(Integer key:map.keySet()){
            if(map.get(key)>nums.length/2){
                return key;
            }
        }
        return -1;
    }
}
```

方法二：摩尔投票法（最优解）
原理：正方票数加一，反方票数减一；
结论1：在本题中，记数组中出现次数超过一半的数字为m（正方），其他数字为反方，则所有数字加起来的票数和恒大于0；
结论2：记数组长度为n，数组中前x个数字的票数和为0，那么后（n-x）个数字的票数和必大于零，且后(n-x)个数字中出现次数超过一半的数字必为m

```java
class Solution {
    public int majorityElement(int[] nums) {
        int target =0;
        int votes = 0;
        for(int e:nums){
            if(votes==0){
                target=e;
            }
            votes+=target==e?1:-1;
            // votes=votes+((target==e)?1:-1);
        }
        return target;
    }
}
```

- 构建乘数积：给定一个数组 A[0,1,…,n-1]，请构建一个数组 B[0,1,…,n-1]，其中 B[i] 的值是数组 A 中除了下标 i 以外的元素的积, 即 B[i]=A[0]×A[1]×…×A[i-1]×A[i+1]×…×A[n-1]。不能使用除法。

```java
class Solution {
    public int[] constructArr(int[] a) {
        if(a.length==0) return new int[]{};
        int[] b = new int[a.length];
        int temp =1;
        b[0]=1;
        //计算下三角元素的乘积
        for(int i=1;i<a.length;i++){
            b[i]=b[i-1]*a[i-1];
        }
        //计算上三角元素的乘积
        for(int j = a.length-2;j>=0;j--){
            temp*=a[j+1];
            b[j]*=temp;
        }
        return b;
    }
}

```

## 数学（中等）

- Ⅰ-剪绳子：给你一根长度为 n 的绳子，请把绳子剪成整数长度的 m 段（m、n都是整数，n>1并且m>1），每段绳子的长度记为 k[0],k[1]...k[m-1] 。请问 k[0]*k[1]*...*k[m-1] 可能的最大乘积是多少？例如，当绳子的长度是8时，我们把它剪成长度分别为2、3、3的三段，此时得到的最大乘积是18。

```java
//数学推导（均值不等式，求导）解法：
class Solution {
    public int cuttingRope(int n) {
        if(n<=3){
            return n-1;
        }
        int a =n/3;
        int b =n%3;
        if(b==0){
            return (int)Math.pow(3,a);
        }else if(b==1){
            return (int)Math.pow(3,a-1)*4;
        }else if(b==2){
            return (int)Math.pow(3,a)*2;
        }
        return -1;
    }
}
//Math.pow()可以认为时间复杂度为O(1)
```

- 57-Ⅱ 和为s的连续正数序列：输入一个正整数 target ，输出所有和为 target 的连续正整数序列（至少含有两个数）。序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。

```java
class Solution{
    public int[][] findContinuousSequence(int target){
        int i=1;
        double j =2.0;
        List<int[]> res = new ArrayList<>();
        while(i<j){
            //2/1.0=2.0,2.0/1=2.0,5/2=2,5.0/2=2.5,5/2.0=2.5
            j=(-1+Math.sqrt(1+4*(2*target+(long)i*i-i)))/2;
            //j==(int)j:判断j是否为整数
            if(i<j&&j==(int)j){
                int[] ans = new int[(int)j-i+1];
                for(int k=i;k<=(int)j;k++){
                    ans[k-i]=k;
                }
                res.add(ans);
            }
            i++;
        }
        return res.toArray(new int[][]{});
    }
}

```

- 圆圈中最后剩下的数字:0,1,···,n-1这n个数字排成一个圆圈，从数字0开始，每次从这个圆圈里删除第m个数字（删除后从下一个数字开始计数）。求出这个圆圈里剩下的最后一个数字。例如，0、1、2、3、4这5个数字组成一个圆圈，从数字0开始每次删除第3个数字，则删除的前4个数字依次是2、0、4、1，因此最后剩下的数字是3。

```java
//动态规划：状态转移方程为f(n)=(f(n-1)+m)%n，其中f(n)为原问题的解
class Solution {
    public int lastRemaining(int n, int m) {
        int dp=0;
        for(int i=2;i<=n;i++){
            dp=(dp+m)%i;
        }
        return dp;
    }
}
```

## 模拟（中等）

- 顺时针打印矩阵：输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字。

```java
class Solution{
    public int[] spiralOrder(int[][] matrix){
        if(matrix.length==0) return new int[]{};
        int left=0;
        int right =matrix[0].length-1;
        int top =0;
        int bottom =matrix.length-1;
        int index =0;
        int[] res = new int[(right+1)*(bottom+1)];
        while(true){
            //从左到右
            for(int i=left;i<=right;i++){
                res[index++]=matrix[top][i];
            }
            //上边界向内缩进一格
            if(++top>bottom) break;
            //从上到下
            for(int i=top;i<=bottom;i++){
                res[index++]=matrix[i][right];
            }
            //右边界向内缩进一格
            if(--right<left) break;
            //从右向左
            for(int i=right;i>=left;i--){
                res[index++]=matrix[bottom][i];
            }
            //下边界向内缩进一格
            if(top>--bottom) break;
            //从下向上
            for(int i=bottom;i>=top;i--){
                res[index++]=matrix[i][left];
            }
            //左边界向内缩进一格
            if(right<++left) break;
        }
        return res;
    }
}
```

- 栈的压入、弹出序列：输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否为该栈的弹出顺序。假设压入栈的所有数字均不相等。例如，序列 {1,2,3,4,5} 是某栈的压栈序列，序列 {4,5,3,2,1} 是该压栈序列对应的一个弹出序列，但 {4,3,5,1,2} 就不可能是该压栈序列的弹出序列。

```java
//自己写出来的
class Solution {
    public boolean validateStackSequences(int[] pushed, int[] popped) {
        //建立一个辅助栈Stack进行模拟
        Stack<Integer> stack = new Stack<>();
        int i =0;
        for(int e:pushed){
            if(!stack.isEmpty()){
                while(stack.peek()==popped[i]){
                    stack.pop();
                    i++;
                    if(stack.isEmpty()) break;
                }
            }
            stack.push(e);
            if(e==popped[i]){
                stack.pop();
                i++;
            }
        }
        while(!stack.isEmpty()){
            if(stack.pop()!=popped[i]){
                return false;
            }
            i++;
        }
      return true;
    }
}
//K神的答案
class Solution {
    public boolean validateStackSequences(int[] pushed, int[] popped) {
        Stack<Integer> stack = new Stack<>();
        int i = 0;
        for(int num : pushed) {
            stack.push(num); // num 入栈
            while(!stack.isEmpty() && stack.peek() == popped[i]) { // 循环判断与出栈
                stack.pop();
                i++;
            }
        }
        return stack.isEmpty();//巧妙
    }
}
```

## 字符串（中等）

- 表示数值的字符串：请实现一个函数用来判断字符串是否表示数值（包括整数和小数）

数值（按顺序）可以分成以下几个部分：

- 若干空格
- 一个 小数 或者 整数
- （可选）一个 'e' 或 'E' ，后面跟着一个 整数
- 若干空格

小数（按顺序）可以分成以下几个部分：

- （可选）一个符号字符（'+' 或 '-'）
下述格式之一：
- 至少一位数字，后面跟着一个点 '.'
- 至少一位数字，后面跟着一个点 '.' ，后面再跟着至少一位数字
- 一个点 '.' ，后面跟着至少一位数字

整数（按顺序）可以分成以下几个部分：

- （可选）一个符号字符（'+' 或 '-'）
- 至少一位数字

```java
class Solution {
    public boolean isNumber(String s) {
        //判断字符串s是否为空或者Null
        if(s==null||s.length()==0){
            return false;
        }
        //标记是否遇到数位
        boolean isNum = false;
        //标记是否遇到小数点
        boolean isPoint = false;
        //标记是否遇到字符'e'或'E'
        boolean isEOre = false;
        //删除字符串s的首尾空格，并将s转化为字符数组
        char[] charArray = s.trim().toCharArray();
        //遍历字符数组charArray
        for(int i =0;i<charArray.length;i++){
            //判断当前字符是否为0-9之间的数位
            if(charArray[i]>='0'&&charArray[i]<='9'){
                isNum=true;
            }else if(charArray[i]=='.'){
                //判断小数点之前是否有重复的小数点或者有e或E
                if(isPoint||isEOre){
                    return false;
                }
                //标记遇到小数点
                isPoint=true;
            }else if(charArray[i]=='e'||charArray[i]=='E'){
                //如果'e'和'E'前面有整数或者有重复的e或E，则返回false
                if(!isNum||isEOre){
                    return false;
                }
                //标记已经遇到'e'或者'E'
                isEOre=true;
                //重置isNum，防止出现类似123e或者123e+的例子
                isNum=false;
            }else if(charArray[i]=='-'||charArray[i]=='+'){
                //正负号只可能出现在首位或者紧接着'e'或者'E'的后面
                if(i!=0&&charArray[i-1]!='e'&&charArray[i-1]!='E'){
                    return false;
                }
            }else{
                return false;
            }
        }
        return isNum;
    }
}
```

- 把字符串转化成整数：
写一个函数 StrToInt，实现把字符串转换成整数这个功能。不能使用 atoi 或者其他类似的库函数。首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。当我们寻找到的第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字组合起来，作为该整数的正负号；假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成整数。该字符串除了有效的整数部分之后也可能会存在多余的字符，这些字符可以被忽略，它们对于函数不应该造成影响。注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换。在任何情况下，若函数不能进行有效的转换时，请返回 0。说明：假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 [−231,  231 − 1]。如果数值超过这个范围，请返回  INT_MAX (231 − 1) 或 INT_MIN (−231) 。

```java
    public static int strToInt(String str) {
        //去掉字符串首尾的空格
        str = str.trim();
        if (str == null || str.length() == 0) {
            return 0;
        }
        int res;
        int begin = 0;
        int end = 0;
        boolean flag = true;
        for (int i = 0; i < str.length(); i++) {
            //第一个字符非数位，非符号位直接return 0
            if (str.charAt(i) != '-' && str.charAt(i) != '+' && (str.charAt(i) < '0' || str.charAt(i) > '9') && flag) {
                return 0;
            } else if (str.charAt(i) >= '0' && str.charAt(i) <= '9') {//判断字符是否是数位
                if (flag) {
                    flag = false;
                }
                end = i;
            } else if (str.charAt(i) == '-' || str.charAt(i) == '+') {//判断字符是否是符号位
                //连续两位是否都为符号位，避免出现类似+-2的情况
                //下面条件中加上end==0避免样例"21474836++"输出结果为0的情况
                if (i + 1 < str.length() && !(str.charAt(i + 1) >= '0' && str.charAt(i + 1) <= '9')&&end==0) {
                    return 0;
                }
                if((i-1)>=0&&str.charAt(i-1) >= '0' && str.charAt(i-1) <= '9'){
                    break;
                }
                begin = i;
            } else if (!(str.charAt(end + 1) >= '0' && str.charAt(end + 1) <= '9')) {//判断字符是否是数位
                break;
            }
        }
        String s = str.substring(begin, end + 1);
        // if(res=="-"||res=="+"){return 0;}会导致Long.parseLong(res)报错
        if ("+".equals(s) || "-".equals(s)){
            return 0;
        }
        //try catch捕获异常
        try {
            res = Integer.parseInt(s);
        } catch (NumberFormatException e) {
            if (s.charAt(0) == '-') {
                return Integer.MIN_VALUE;
            } else {
                return Integer.MAX_VALUE;
            }
        }
        return Integer.parseInt(s);
    }
//对if-elseif的语法不熟悉:
if(expression 1){
    content 1
}else if(expression 2){
    content 2
}else if(expression 3){
   content 3
}else{
    content 4
}
if-else if语法：如果expression 1为true，那么会执行content 1，即使expression 2或者expression 3为true，也不会执行content 2或者content 3或者content 4
```


## 栈与队列（困难）

- Ⅰ-滑动窗口的最大值：给定一个数组 `nums` 和滑动窗口的大小 `k`，请找出所有滑动窗口里的最大值

```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
      if(nums.length == 0 || k == 0) return new int[0];
        Deque<Integer> deque = new LinkedList<>();
        int[] res = new int[nums.length - k + 1];
        // 未形成窗口
        for(int i = 0; i < k; i++) {
            while(!deque.isEmpty() && deque.peekLast() < nums[i])
                deque.removeLast();
            deque.addLast(nums[i]);
        }
        res[0] = deque.peekFirst();
        // 形成窗口后
        for(int i = k; i < nums.length; i++) {
            //需要重点理解
            if(deque.peekFirst() == nums[i - k])
                deque.removeFirst();
            while(!deque.isEmpty() && deque.peekLast() < nums[i])
                deque.removeLast();
            deque.addLast(nums[i]);
            res[i - k + 1] = deque.peekFirst();
        }
        return res;
    }
}
```

复习队列知识：

队列：尾部添加元素，头部删除元素

双端队列（deque）：允许在头部和尾部都高效的添加或删除元素，即在队列两端都可以进行删除和添加

- Ⅱ 队列的最大值：请定义一个队列并实现函数 max_value 得到队列里的最大值，要求函数max_value、push_back 和 pop_front 的均摊时间复杂度都是O(1)。若队列为空，pop_front 和 max_value 需要返回 -1

```java
class MaxQueue {

    Deque<Integer> list;
    Queue<Integer> queue;

    public MaxQueue() {
        list=new LinkedList<>();
        queue=new LinkedList<>();
    }

    public int max_value() {
        if(list.isEmpty()){
            return -1;
        }
        return list.peekFirst();
    }
    
    public void push_back(int value) {
        queue.add(value);
        while(!list.isEmpty()&&value>list.peekLast()){
            list.removeLast();
        }
        list.addLast(value);
    }
    
    public int pop_front() {
        //判断队列是否为空
        if(queue.isEmpty()||list.isEmpty()){
            return -1;
        }
        //queue.peek()==list.peekFirst()必为false，queue.peek()返回的是包装类Integer，list.peekFirst()返回的也是包装类Integer，两个包装类比较值要用equals
        if(queue.peek().equals(list.peekFirst())){
            queue.poll();
            return list.removeFirst();
        }else{
            return queue.poll();
        }
        
    }
}

/**
 * Your MaxQueue object will be instantiated and called as such:
 * MaxQueue obj = new MaxQueue();
 * int param_1 = obj.max_value();
 * obj.push_back(value);
 * int param_3 = obj.pop_front();
 */
```

## 搜索与回溯算法（困难）

- 序列化二叉树

请实现两个函数，分别用来序列化和反序列化二叉树。你需要设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。

```java
public class Codec {
    String res = "";
    public String serialize(TreeNode root){
        //递归终止条件
        if (root==null){
            res+="null,";
            return res;
        }
        res+=root.val+",";
        serialize(root.left);
        serialize(root.right);
        return res;
    }

    /**
     * 联系如何根据前序和中序重建二叉树以及根据中序和后序重建二叉树
     * @param data
     * @return
     */
    public TreeNode deserialize(String data){
        String[] split = data.split(",");
        List<String> list = new ArrayList<>(Arrays.asList(split));
        return redeserialize(list);
    }
    
    public TreeNode redeserialize(List<String> list){
        //递归终止条件
        if (list.get(0).equals("null")){
            list.remove(0);
            return null;
        }
        TreeNode root = new TreeNode(Integer.valueOf(list.get(0)));
        list.remove(0);
        root.left = redeserialize(list);
        root.right = redeserialize(list);
        return root;
    }
}

class TreeNode{
    int val;
    TreeNode left;
    TreeNode right;
    public TreeNode(int val){
        this.val = val;
    }
    public TreeNode(int val,TreeNode left,TreeNode right){
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

```

- 字符串的排列

输入一个字符串，打印出该字符串中字符的所有排列。你可以以任意顺序返回这个字符串数组，但里面不能有重复元素。

```java
public class Permutation {

    public String[] permutation(String s){
        List<String> list = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean[] used = new boolean[s.length()];
        char[] charArray = s.toCharArray();
        //为了防止"aba"等字符串出现，需要先对字符串进行排序
        Arrays.sort(charArray);
        s = new String(charArray);
        backtracking(s,list,sb,used);
        int index = 0;
        String[] res = new String[list.size()];
        for (String e : list) {
            res[index++] = e;
        }
        return res;
    }

    //确定递归函数参数及返回值
    private void backtracking(String s, List<String> list,StringBuilder sb,boolean[] used){
        //终止条件
        if (sb.length()==s.length()){
            list.add(sb.toString());
            return;
        }
        //单层递归逻辑
        for (int i = 0; i < s.length(); i++) {
            if (i>0&&s.charAt(i-1)==s.charAt(i)&&used[i-1]==false){
                continue;
            }
            if (used[i]){
                continue;
            }
            sb.append(s.charAt(i));
            used[i] = true;
            //递归
            backtracking(s,list,sb,used);
            //回溯
            sb.deleteCharAt(sb.length()-1);
            used[i] = false;
        }
    }
}
```

总结：和代码随想录中回溯专题的全排列Ⅱ很像。

## 动态规划（困难）

- 丑数

我们把只包含质因子 2、3 和 5 的数称作丑数（Ugly Number）。求按从小到大的顺序的第 n 个丑数。

暴力解法：

```java
public class NthUglyNumber {

    public int nthUglyNumber(int n){
        int count = 0;
        int res = 0;
        for (int i = 1; i < Integer.MAX_VALUE; i++) {
           if (isUglyNumber(i)){
               count++;
           }
           if (count==n){
               res = i;
               break;
           }
        }
        return res;
    }

    boolean isUglyNumber(int x){
       if (x==1){
           return true;
       }
       while (x%2==0){
           x/=2;
       }
       while (x%3==0){
           x/=3;
       }
       while (x%5==0){
           x/=5;
       }
       return x==1?true:false;
    }

}

```

空间换时间解法：

```java
public class NthUglyNumber {

    public static void main(String[] args) {
        NthUglyNumber nthUglyNumber = new NthUglyNumber();
        nthUglyNumber.nthUglyNumber(1352);
    }

    public int nthUglyNumber(int n){
        int[] uglyArr = new int[n];
        uglyArr[0] = 1;
        int index = 1;
        //指针p2代表在数组中索引小于p2的元素乘以2小于等于目前数组中最大的丑数
        int p2 = 0;
        int p3 = 0;
        int p5 = 0;
        while (index<n){
            uglyArr[index] = minUglyNumber(uglyArr[p2]*2,uglyArr[p3]*3,uglyArr[p5]*5);
            while (uglyArr[p2]*2<=uglyArr[index]){
                p2++;
            }
            while (uglyArr[p3]*3<=uglyArr[index]){
                p3++;
            }
            while (uglyArr[p5]*5<=uglyArr[index]){
                p5++;
            }
            index++;
        }
        return uglyArr[n-1];
    }

    //三个数中求最小值
    public int minUglyNumber(int multiplyTwo,int multiplyThree,int multiplyFive){
        int min = Math.min(multiplyFive,multiplyThree);
        return min<multiplyTwo?min:multiplyTwo;
    }

}
```