---
title: LeetBook
date: 2022-3-30
tags: 
- 力扣
categories:
- Algorithm
---

## 笔记

算法复杂度：

1. 空间复杂度S(n)中的S是Space的缩写，时间复杂度T(n)中的T是Time的缩写，其中n代表的是数据规模，S(n)和T(n)都是n的函数

2. 空间复杂度S(n):根据算法写成的程序在执行时占用存储单元的长度 

3. 时间复杂度T(n):根据算法写成的程序在执行时耗费时间的长度

时间复杂度的渐进表示法：

```java
T(n)=O(f(n))表示存在常数C>0,n0>0使得当n>=n0时有T(n)<=C*f(n)，f(n)为T(n)的一个上界，上界有无穷多个，一般取较小那个
T(n)=Ω(g(n))表示存在常数C>0,n0>0使得当n>=n0时有T(n)>=C*g(n)，g(n)为T(n)的一个下界，下界有无穷多个，一般取较大那个
T(n)=θ(h(n))表示同时有T(n)=O(h(n))和T(n)=Ω(h(n))，h(n)既是上界也是下界
空间复杂度S(n)和上面定义相似
一个函数的参数传入了数组，那么这个数组所带来的空间是不算在空间复杂度内的，计算算法的空间复杂度，是不考虑输入数组的，只考虑算法在运行中额外搞出来的空间
空间复杂度算的是变量的个数
递归算法的空间复杂度通常是递归的层数 
```

算法复杂度计算公式：

```java
T1(n)+T2(n)=max(O(f1(n)),O(f2(n)))
T1(n)xT2(n)=O(f1(n)xf2(n))
```

树：

1. 堆栈，别称栈(Stack)
2. 看根节点遍历顺序来区分是否为前序，中序，后序
3. 二叉树中节点的高度：该节点到叶子节点的最长路径所包含的边数
4. 二叉树的高度：为根节点的高度
5. 叶子节点：没有子节点的节点
6. 节点的层次：规定根节点在1层，其它任一节点的层数是其父节点的层数加1
7. 树的深度：树中所有节点中的最大层次是这棵树的深度

递归：

- 递归的底层使用了栈这一数据结构，执行一个方法的时候会开辟一个新的栈空间，将其压入栈底
- 递归必须向退出递归的条件无限逼近，否则会出现栈溢出

## LeetBook之初级算法

### 数组

1. 删除排序数组中的重复项：一个有序数组，请原地删除重复出现的元素，使得每个元素只出现一次，返回删除后数组的新长度

```java
//认真看题目，只需要返回删除后新的数组的长度就可以了，示例中的输出虽然是：2，nums[1,2]或者5，nums=[0,1,2,3,4],但是我们不需要写代码把nums[1,2]或者nums=[0,1,2,3,4]表达出来，因为leetcode系统内部给我们封装好了一套机制，只需要返回数组长度，判题系统内部会打印出nums[x,y,z...]，进而会与答案进行对比
class Solution {
    public int removeDuplicates(int[] nums) {
        //采用双指针算法
        if(nums.length==0){
            return 0;
        }
        int fast =1;
        int slow =1;
        while(fast<nums.length){
            if(nums[fast]!=nums[fast-1]){
                nums[slow]=nums[fast];
                slow++;
            }
            fast++;
        }
        return slow;
    }
}
复杂度分析：
时间复杂度：O(n),n为数组nums的长度
空间复杂度：O(1)
```

2. 买卖股票的最佳时机II:数组prices[i]是一支给定股票第i天的价格，设计一个算法计算可以获取的最大利润（注意股票买了之后要先卖出，然后才能再买）

```java
//i代表天数，下面的for循环中，如果起始表达式写成int i = 0，会报错（数组下标越界）
class Solution {
    public int maxProfit(int[] prices) {
        //采用遍历数组算法
        // 当数组长度为0或者1的时候
        if(prices.length==0||prices.length==1){
            return 0;
        }
        int profit =0;
        for(int i=1;i<prices.length;i++){
            if(prices[i]>prices[i-1]){
                profit=profit+prices[i]-prices[i-1];
            }
        }
        return profit;
    }
}
```

3. 旋转数组：一个数组，把数组中的元素向右移动k个位置(k大于等于0)

```java
//解法1：额外的数组
class Solution {
    public void rotate(int[] nums, int k) {
        // 额外的数组
        int n = nums.length;
        int[] array = new int[n];
        for(int i = 0;i<nums.length;i++){
            array[(i+k)%n]=nums[i];
        }
        //将新数组拷贝到原数组
        System.arraycopy(array,0,nums,0,n);
    }
    
}
//arraycopy(Object src,int srcPos,Object dest,int destPos,int length)是System类的一个静态方法，将一个数组拷贝到另外一个数组
//arraycopy(Object src,int srcPos,Object dest,int destPos,int length)的参数
//src-the source array
//srcPos-starting position in the source array
//dest-the destination array
//destPos-starting destination in the destination data
//length-the number of array elements to be copied

//解法2：数组翻转
class Solution {
    public void rotate(int[] nums, int k) {
        // 翻转数组
        int d = k%nums.length;
        reverse(nums,0,nums.length-1);
        reverse(nums,0,d-1);
        reverse(nums,d,nums.length-1);        
    }
    public void reverse(int[] nums,int start,int end){
    while(start<end){
        int temp =nums[start];
        nums[start]=nums[end];
        nums[end]=temp;
        start++;
        end--;
    }
}
}
//注意reverse函数不要写到rotate函数内部
```

4. 存在重复元素：一个整数数组，如果有一个值出现了至少2次，函数返回true，如果每个元素都不相同，函数返回false

```java
//排序
//java.util.Arrays中有一个静态方法sort()可以对数组中的元素按从小到大进行排序
class Solution {
    public boolean containsDuplicate(int[] nums) {
        Arrays.sort(nums);
        for(int i =1;i<nums.length;i++){
            if(nums[i]==nums[i-1]){
                return true;
            }
        }
        return false;
    }
}
//Arrays.sort()底层用的是Dual-Pivot Quicksort排序方法，时间复杂度为O(nlogn)
复杂度分析：
时间复杂度：O(nlogn)，n为数组的长度(本段程序中，sort排序方法复杂度为o(nlogn),其余程序复杂度为O(n)，总体复杂度取较大者O(nlogn))
空间复杂度：O(logn)
```

5. 只出现一次的数字：给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素

```java
//异或运算符：^
//异或运算性质：
//任何数和0做异或结果依然是本身（非零数和零做异或结果为非零数）：a^0=a
//任何数和自身做异或结果为0（相同数做异或结果为0）：a^a=0

//异或运算满足交换律和结合律：a^b^c=a^c^b=a^(c^b)
class Solution {
    public int singleNumber(int[] nums) {
        //采用异或运算
        int a = 0;
        for(int num : nums){
            a^=num;
        }
        return a;
    }
}
```

6. 两个数组的交集II:给定两个数组，编写一个函数来计算他们的交集

```java
//变量初始化最好不要写成int index,index1,index2=0;
//Math.min(int a,int b):返回a,b中的较小值
//Arrays.copyOfRange(xxx[] a,int start,int end):返回一个和数组a类型相同的数组，返回的数组的长度=end-start
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        //采用双指针和排序
        int d1 =nums1.length;
        int d2 =nums2.length;
        // int index,index1,index2=0;
        int index=0;
        int index1=0;
        int index2=0;
        int[] array = new int[Math.min(d1,d2)];
        Arrays.sort(nums1);
        Arrays.sort(nums2);
        while(index1<d1 && index2<d2){
            if(nums1[index1]==nums2[index2]){
                array[index]=nums1[index1];
                index++;
                index1++;
                index2++;
            }else if(nums1[index1]>nums2[index2]){
                index2++;
            }else{
                index1++;
            }
        }
        return Arrays.copyOfRange(array,0,index);
    }
}
```

7. 加一：给定一个整数组成的非空数组所表示的非负整数，在该数的基础上加一。最高位数字存放在数组的首位，数组中每个元素只存储单个数字。除了[0]之外，数组不会以0开头

```java
//没考虑到[9,9]，[1,9,9]等这类的情况
class Solution {
    public int[] plusOne(int[] digits) {
        for(int i =digits.length-1;i>=0;i--){
            digits[i]++;
            digits[i]=digits[i]%10;
            if(digits[i]!=0){
                return digits;
            }
        }
        //当数组是[9,9]这种情况时，新初始化一个digits.length+1的数组，int类型的数组中的元素默认值为0
        int[] array = new int[digits.length+1];
        array[0]=1;
        return array;
    }
}
```

8. 移动零

```java
class Solution {
    public void moveZeroes(int[] nums) {
        //采用双指针，进行两次遍历
        int j =0;
        //指针j记录数组中非零元素的个数，第一次遍历数组，把非零的元素依次提到数组的前面
        for(int i=0;i<nums.length;i++){
            if(nums[i]!=0){
                nums[j]=nums[i];
                j++;
            }
        }
        //非零元素后面的元素都变为0
        for(int i=j;i<nums.length;i++){
            nums[i]=0;
        }
    }
}
```

9. 两数之和:给定一个数组和一个值（记为target），找出数组中的两个数，使得它们的值加起来等于target，返回这两个数的下标，假设答案只有一个

```java
//return语句代码可以简化：return new int[]{i,j};
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int j =0;
        int len =nums.length;
        //不用排序，如果是[3,2,4]，target=6，下标为1和2，如果排序了，[2,3,4],target=6，下标为0和2，测试通不过
        //Arrays.sort(nums);
        int[] array =new int[2];
        while(j<len){
            for(int i =j+1;i<len;i++){
                if(nums[j]+nums[i]==target){
                    array[0]=i;
                    array[1]=j;
                    //return array;//只在if条件语句块里面起作用，可以不用写
                }
            }
            j++;
        }
        return array;
    }
}
```

10. 有效的数独：判断一个数独是否有效

```java
class Solution {
    public boolean isValidSudoku(char[][] board) {
        Map<Integer,Set<Integer>> row = new HashMap<>();
        Map<Integer,Set<Integer>> col = new HashMap<>();
        Map<Integer,Set<Integer>> area = new HashMap<>();
        for(int i=0;i<9;i++){
            row.put(i,new HashSet<>());
            col.put(i,new HashSet<>());
            area.put(i,new HashSet<>());
        }
        for(int i=0;i<9;i++){
            for(int j=0;j<9;j++){
                char c =board[i][j];
                if(c=='.') continue;
                int u=c-'0';
                //解题的关键：怎样根据i和j的关系，判断当前格在哪一个小九宫格内（小九宫格编号为0，1，2，3，4，5，6，7，8）
                int index=i/3*3+j/3;
                if(row.get(i).contains(u)||col.get(j).contains(u)||area.get(index).contains(u)) return false;
                row.get(i).add(u);
                col.get(j).add(u);
                area.get(index).add(u);
            }
        }
        return true;
    }
}
//如何把字符'9'变为整数9
	@Test
    void contextLoads() {
        char a ='9';
        int b =a-'0';//相应的ASCII码进行运算，'0'对应的ASCII码为48，而'9'对应的ASCII码为57
        System.out.println("整数b = " + b);
    }
```

11. 旋转图像：给定一个nxn的二维数组matrix（矩阵），请将图像顺时针旋转90度

```java
class Solution {
    public void rotate(int[][] matrix) {
        int n =matrix.length;
        int[][] matrix_new = new int[n][n];//定义一个额外的二维数组matrix_new
        for(int i =0;i<n;i++){
            for(int j =0;j<n;j++){
                matrix_new[j][n-i-1]=matrix[i][j];//将原二维
            }
        }
        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                matrix[i][j]=matrix_new[i][j];
            }
        }
    }
}

//笔记：
	@Test
    void contextLoads() {
       int[][] a =new int[5][10];
       int len =a.length;//获取二维数组a的行数
       int x =a[0].length;//获取第一行的长度（也就是第一行的列数）
       System.out.println("len = " + len);//len=5
       System.out.println(x);//x=10
    }
```

### 链表

1. 删除链表中的节点：编写一个函数，使其可以删除某个链表中给定的（非末尾）节点。传入函数的唯一参数为要被删除的节点。

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
    public void deleteNode(ListNode node) {
        node.val=node.next.val;
        node.next=node.next.next;
    }
}
```

2. 删除链表的倒数第n个节点

```java
//解法一：计算链表的长度
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0,head);
        int len = getLength(head);
        ListNode a =dummy;
        for(int i=1;i<len-n+1;i++){
            a=a.next;
        }
        a.next=a.next.next;//不要写成了a=a.next.next（原本管理倒数第n+1个节点的a，去管理倒数第n-1个节点）
        dummy=dummy.next;
        return dummy;
    }
    int getLength(ListNode head){
            int cnt=0;
        //指针里面嵌套了一个指针
            while(head!=null){
                cnt++;
                head=head.next;
            }    
            return cnt;
        }
}
//解法二：栈
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy=new ListNode(0,head);
        ListNode currentNode=dummy;
        LinkedList<ListNode> stack = new LinkedList<ListNode>();
        while(currentNode!=null){
            stack.push(currentNode);
            currentNode=currentNode.next;
        }
        for(int i=0;i<n;i++){
            stack.pop();
        }
        ListNode preNode=stack.peek();
        preNode.next=preNode.next.next;
        dummy=dummy.next;
        return dummy;
    }     
}

//解法三：双指针
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0,head);
        //second指针指向dummy节点
        ListNode second = dummy;
        //first指针指向head节点
        ListNode first = head;
        //first指针遍历链表n次
        for(int i = 0;i<n;i++){
            first=first.next;
        }
		//first指针遍历到链表末尾时，second指针此时指向被删除节点的前驱节点
        while(first!=null){
            first=first.next;
            second=second.next;
        }
        second.next=second.next.next;
        dummy=dummy.next;
        return dummy;
    }     
}
```

3. 反转链表:给定单链表的头节点head，请你反转链表，然后返回反转后的链表

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int 
 val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
//迭代法
//返回反转后的链表，只需要返回新链表的头节点就好了
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode preNode=null;
        ListNode curNode=head;
        while(curNode!=null){
            ListNode nextNode=curNode.next;
            curNode.next=preNode;
            preNode=curNode;
            curNode=nextNode;
        }
        return preNode;
    }
}
```

4. 合并两个有序链表：两个链表都是升序

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
//迭代法
class Solution {
    //l1为啥是头节点？:数组的地址就是第一个元素的地址
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy =new ListNode(0);
        ListNode prev =dummy;
        while(l1!=null&&l2!=null){
            if(l1.val<=l2.val){
                prev.next=l1;
                l1=l1.next;
            }else{
                prev.next=l2;
                l2=l2.next;
            }
            prev=prev.next;
        }
        prev.next=(l2==null? l1 : l2);
        return dummy.next;
    }
}
```

5. 回文链表

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
//解法一：将值复制到数组中后使用双指针
class Solution {
    public boolean isPalindrome(ListNode head) {
    //回文链表：正向遍历和反向遍历都一样的链表
    //遍历链表，将链表中每个节点的值复制到数组中去
    List<Integer> vals = new ArrayList<Integer>();
    ListNode curNode=head;
    while(curNode!=null){
        vals.add(curNode.val);
        curNode=curNode.next;
    }
    // 使用双指针判断是否回文
    int first =0;
    int last=vals.size()-1;
    while(first<last){
        //判断的时候可以多用equals方法
        if(!vals.get(first).equals(vals.get(last))) return false;
        first++;
        last--;
    }
    return true;
    }
}
```

6. 环形链表:如果链表中有环，那么返回true；否则，返回false

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
//解法一：哈希表
public class Solution {
    public boolean hasCycle(ListNode head) {
        // 采用hash表
        Set<ListNode> nodes = new HashSet<ListNode>();
        while(head!=null){
            if(!nodes.add(head)) return true;
            head=head.next;
        }
        return false;
    }
}
//解法二：快慢指针
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public boolean hasCycle(ListNode head) {
        // 快慢指针
        if(head==null||head.next==null) return false;
        ListNode slow=head;
        ListNode fast=head.next;
        while(slow!=fast){
            if(fast==null||fast.next==null) return false;
            slow=slow.next;
            fast=fast.next.next;
        }
        return true;
    }
}
```

### 树

1. 求二叉树的最大深度

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
//深度优先搜索
class Solution {
    public int maxDepth(TreeNode root) {
        if(root==null) return 0;
        int leftHeight=maxDepth(root.left);
        int rightHeight=maxDepth(root.right);
        return Math.max(leftHeight,rightHeight)+1;
    }
}
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
//采用广度优先搜索一层一层比较
class Solution {
    public int maxDepth(TreeNode root) {
        if(root==null) return 0;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int ans =0;
        while(!queue.isEmpty()){
            int size=queue.size();
            while(size>0){
                TreeNode node = queue.poll();
                if(node.left!=null) queue.offer(node.left);
                if(node.right!=null) queue.offer(node.right);
                size--;
            }
            ans++;
        }
        return ans;
    }
}
```

2. 验证是否为二叉搜索树

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
//中序遍历法
class Solution {
 public boolean isValidBST(TreeNode root) {
        LinkedList<TreeNode> stack = new LinkedList<>();
        long a = -Long.MAX_VALUE;
        while(!stack.isEmpty()||root!=null){
        while(root!=null){
            stack.push(root);
            root=root.left;
        }
        TreeNode curNode=stack.pop();
        if(curNode.val<=a) return false;
        a=curNode.val;
        root=curNode.right; 
        }
        return true;
    }
}
//Integer类中的MIN_VALUE = 0x80000000和MAX_VALUE = 0x7fffffff
//0x80000000和0x7fffffff是16进制的数，换成10进制表示：0x80000000等于-2^31，而0x7fffffff等于2^31-1
//不能简单地认为MAX_VALUE+1=2^31(因为MAX_VALUE是二进制数，而1是10进制的数，要先把10进制的1换算成二进制的数，然后在进行运算)
//Integer.MAX_VALUE+1=Integer.MIN_VALUE
```

3. 给你一个二叉树，检查它是否是镜像对称的

```java
//解法一：递归
class Solution{
    public boolean isSymmetric(TreeNode root){
        if(root==null) return true;//当root为null时，return false提交也可以通过
        return dfs(root.left,root.right);
    }
    boolean dfs(TreeNode left,TreeNode right){
        if(left==null&&right==null) return true;
        if(left==null||right==null) return false;
        if(left.val!=right.val) return false;
        return dfs(left.left,right.right)&&dfs(left.right,right.left);
    }
}
//解法二：用队列的链式存储
class Solution {
    public boolean isSymmetric(TreeNode root) {
        if(root==null||(root.left==null&&root.right==null)) return true;
        LinkedList<TreeNode> queue=new LinkedList<>();
        queue.add(root.left);
        queue.add(root.right);
        while(queue.size()>0){
            TreeNode left =queue.removeFirst();
            TreeNode right =queue.removeFirst();
            if(left==null&&right==null) continue;
            if(left==null||right==null) return false;
            if(left.val!=right.val) return false;
            queue.add(left.left);
            queue.add(right.right);
            queue.add(left.right);
            queue.add(right.left);
        }
        return true;
    }
}
```

4. 对二叉树进行层序遍历

```java
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> array = new ArrayList<>();//注意二维数组的表示方法
        //Queue<TreeNode> queue1 = new ArrayList<>();会报错Cannot infer arguments
        Queue<TreeNode> queue = new ArrayDeque<>();
        //如果不判断传进来的root是否为空，直接queue.add(root)，会报空指针异常
        if(root!=null){
            queue.add(root);
        }
        while(!queue.isEmpty()){
            //ArrayList<E>()中的E(Element)是java中的泛型，用于集合中
            List<Integer> list = new ArrayList<>();
            int size = queue.size();
            for(int i=0;i<size;i++){
                TreeNode node =queue.poll();
                list.add(node.val);
                if(node.left!=null){
                    queue.add(node.left);
                }
                if(node.right!=null){
                    queue.add(node.right);
                }
            }
            array.add(list);
        }
        return array;
    }
}
```

5. 将有序数组转换为二叉搜索树

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
       return recursion(nums,0,nums.length-1);
    }
    public TreeNode recursion(int[] nums,int left,int right){
        if(left>right) return null;
        int mid =(left+right)/2;
        TreeNode root =new TreeNode(nums[mid]);
        root.left=recursion(nums,left,mid-1);
        root.right=recursion(nums,mid+1,right);
        return root;
    }
}
```

### 字符串

1. 反转字符串：给你一个字符串，请你编写一个函数将字符串反转过来

```java
class Solution {
    public void reverseString(char[] s) {
        int start =0;
        int end=s.length-1;
        while(start<=end){
            char temp=s[start];
            s[start]=s[end];
            s[end]=temp;
            start++;
            end--;
        }
    }
}
```

2. 整数反转：给你一个32位的有符号整数x，返回x中的数字部分反转后的结果。如果反转后的整数超过32位的有符号整数的范围，就返回0。假定环境不允许存储64位整数（有符号或无符号）

```java
//解法一
//java中怎样表示2的31次方:Math.pow(2,31)，注意Math.pow()方法返回的是Double类型，如果需要转成int类型需要加一个(int)
class Solution {
    public int reverse(int x) {
        int res=0;
        while(x!=0){
            int end =x%10;
            //注意不要把(res==214748364&&end>7)写成了(res=214748364&&end>7)，否则&&符号左边是int类型，而右边是boolean类型，会报错
            //(int)Math.pow(2,31)/10等价于214748364
            if(res>214748364||(res==214748364&&end>7)){
                return 0;
            }
            if(res<-214748364||(res==-214748364&&end<-8))
            {
                return 0;
            }
            res=res*10+end;
            x/=10;
        }
        return res;
    }
}
//-Integer.MIN_VALUE和Integer.MIN_VALUE的值是相等的
//-Integer.MAX_VALUE和Integer.MAX_VALUE的值互为相反数
//java中求余数，如果分子是负数，那么求余数的结果也为负数
//a/b=c中的a为被除数，b为除数，c为商
System.out.println((-123)%10);//-3
System.out.println(123%(-10));//3
System.out.println((-123)%(-10));//-3
System.out.println(123%10);//3
System.out.println(-123/10);//-12
System.out.println(123/-10);//-12
System.out.println(-123/-10);//12
System.out.println(123/10);//12
```

3. 字符串中的第一个唯一字符：给定一个字符串，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回-1

```java
//解法一：采用HashMap进行二次遍历，其中K存储的是字符，V存储的是字符出现的次数
//Hash表中的键是唯一的，如果多次放同一个进去，留下来的是最后一次
//getOrDefault(Object key,V defaultValue)方法：如果传进来的key有对应的value，那么返回key对应的value，否则返回defaultValue
//s.charAt(index)方法：返回索引index所对应的字符
//s.length()：返回字符串的长度
class Solution {
    public int firstUniqChar(String s) {
        HashMap<Character,Integer> map=new HashMap<>();
        for(int i=0;i<s.length();i++){
            char ch=s.charAt(i);
            map.put(ch,map.getOrDefault(ch,0)+1);
        }
        for(int i=0;i<s.length();i++){
            if(map.get(s.charAt(i)).equals(1)) return i;
        }
        return -1;
    }
}
//解法二：哈希表存储索引
class Solution {
    public int firstUniqChar(String s) {
        Map<Character,Integer> index=new HashMap<>();
        int n =s.length();
        for(int i=0;i<n;i++){
            char ch =s.charAt(i);
            if(index.containsKey(ch)){
                index.put(ch,-1);
            }else{
                index.put(ch,i);
            } 
        }
        int first=n;
        //index.entrySet()将把index转换为一个集合
        for(Map.Entry<Character,Integer> entry:index.entrySet()){
            int pos =entry.getValue();
            if(pos!=-1&&pos<first){
                first=pos;
            }
        }
        if(first==n){
            first=-1;
        }
        return first;
    }
}
```

4. 有效的字母异位词：给定两个字符串s和t，如果s和t中每个字符出现的次数一样多，则称s和t互为字母异位词

```java
//解法一：
class Solution {
    public boolean isAnagram(String s, String t) {
        if(s.length()!=t.length()) return false;
        char[] s1=s.toCharArray();
        char[] t1=t.toCharArray();
        //return s1.equals(t1)会输出false，因为s1和t1的地址不一样，可以在IDEA中点击equals，进入源码去看public boolean equals(Object obj){return (this==obj);}
        Arrays.sort(s1);
        Arrays.sort(t1);//以升序的方式对数组中的元素进行排序
        return Arrays.equals(s1,t1);
    }
}
//解法二：
class Solution {
    public boolean isAnagram(String s, String t) {
        if(s.length()!=t.length()) return false;
        //int[] array=new array[26];数组定义错误，基本概念不熟悉
        int[] array=new int[26];
        for(int i=0;i<s.length();i++){
            //两个字符进行加减乘除运算，即两个字符所对应的ASCII码进行相应的加减乘除运算
            // System.out.println('b' - 'a');//1
            // System.out.println('B' - 'A');//1
            // System.out.println('a' - 'b');//-1
            // System.out.println('A' - 'B');//-1
            array[s.charAt(i)-'a'] = array[s.charAt(i)-'a']+1;//如果s.charAt(i)为'A'，那么'A'-'a'的值为65-97=-32，此时数组下标越界了（注意看题目说的是s和t仅包含小写字母）
            array[t.charAt(i)-'a'] = array[t.charAt(i)-'a']-1;
        }
        for(int i=0;i<array.length;i++){
            if(array[i]!=0) return false;
        }
        return true;
    }
}
//可以在IDEA中Debug来查询任意字符所对应的ASCII码值
```

1. 验证回文串：给定一个字符串，验证它是否为回文串，只考虑字母和数字字符，可以忽略字母的大小写

```java
//解法一：使用字符串相关的API
class Solution {
    public boolean isPalindrome(String s) {
        StringBuilder sb = new StringBuilder();
        for(int i=0;i<s.length();i++){
            char ch = s.charAt(i);
            if(Character.isLetterOrDigit(ch)){
                //需要统一大小写，然后才好比较
                sb.append(Character.toUpperCase(ch));
            }
        }
        StringBuilder sbRev = new StringBuilder(sb).reverse();
        //如果用return sbRev.equals(sb)会显示不通过
        return sbRev.toString().equals(sb.toString());
    }
}
//解法二：在解法一的基础上采用双指针
class Solution {
    public boolean isPalindrome(String s) {
        StringBuilder sb = new StringBuilder();
        for(int i=0;i<s.length();i++){
            char ch = s.charAt(i);
            if(Character.isLetterOrDigit(ch)){
                sb.append(Character.toUpperCase(ch));
            }
        }
        int start=0;
        int end=sb.length()-1;
        while(start<=end){
            if(sb.charAt(start)!=sb.charAt(end)){
                return false;
            }
            start++;
            end--;
        }
        return true;
    }
}
//toString():把调用这个方法的那个对象或者变量转换为字符串
//java中自己写一个类，那么这个类会被默认继承自Object这个父类，父类中的方法可以拿来用
```

6、字符串转换整数

```java
class Solution {
    public int myAtoi(String s) {
        int len=s.length();
        if(len==0){
            return 0;
        }
        int index =0;
      char[] charArray=s.toCharArray();
      for(int i=0;i<charArray.length;i++){
          if(charArray[i]!=' '){
              index=i;
              break;
          }
      }
        //判断正负号
        int sign =1;
        if(charArray[index]=='+'){
            index++;
        }else if(charArray[index]=='-'){
            sign=-1;
            index++;
        }

        int res=0;
        while(index<charArray.length){
            if(charArray[index]<'0'||charArray[index]>'9'){
                break;
            }
            if(res>Integer.MAX_VALUE/10||res==Integer.MAX_VALUE/10&&(charArray[index]-'0')>Integer.MAX_VALUE%10){
                return Integer.MAX_VALUE;
            }
            if(res<Integer.MIN_VALUE/10||res==Integer.MIN_VALUE/10&&-(charArray[index]-'0')<Integer.MIN_VALUE%10){
                return Integer.MIN_VALUE;
            }
            res=res*10+sign*(charArray[index]-'0');
            index++;
        }
        return res;
    }
}
//笔记

class Solution {
    public int myAtoi(String s) {
        // if(s==""){
        //     return 0;//leetcode判题系统报错数组下标越界
        // }
        if(s.equals("")){
            return 0;//用equals()会正常通过
        }
        int index =0;
      char[] charArray=s.toCharArray();
      for(int i=0;i<charArray.length;i++){
          if(charArray[i]!=' '){
              index=i;
              break;
          }
      }
        //判断正负号
        int sign =1;
        if(charArray[index]=='+'){
            index++;
        }else if(charArray[index]=='-'){
            sign=-1;
            index++;
        }

        int res=0;
        while(index<charArray.length){
            if(charArray[index]<'0'||charArray[index]>'9'){
                break;
            }
            if(res>Integer.MAX_VALUE/10||res==Integer.MAX_VALUE/10&&(charArray[index]-'0')>Integer.MAX_VALUE%10){
                return Integer.MAX_VALUE;
            }
            if(res<Integer.MIN_VALUE/10||res==Integer.MIN_VALUE/10&&-(charArray[index]-'0')<Integer.MIN_VALUE%10){
                return Integer.MIN_VALUE;
            }
            res=res*10+sign*(charArray[index]-'0');
            index++;
        }
        return res;
    }
}

```

7. 实现strStr()函数，给你两个字符串haystack和needle,请你在haystack字符串中找出needle字符串出现的第一个位置（下标从0开始）。如果不存在，则返回-1。

```java
//暴力解法
class Solution {
    public int strStr(String haystack, String needle) {
        int l1=haystack.length();
        int l2=needle.length();
        char[] h=haystack.toCharArray();
        char[] n=needle.toCharArray(); 
        for(int i=0;i<=l1-l2;i++){
            int b=0;
            int a=i;
            while(b<l2&&h[a]==n[b]){
                b++;
                a++;
            }
            if(b==l2) return i;
        }
        return -1;
    }
}
```

8. 外观数列

```java
class Solution {
    public String countAndSay(int n) {
        String str ="1";
        for(int i=2;i<=n;i++){
            StringBuilder sb =new StringBuilder();
            int start =0;
            int pos=0;
            while(pos<str.length()){
                while(pos<str.length()&&str.charAt(pos)==str.charAt(start)){
                    pos++;
                }
                sb.append(Integer.toString(pos-start)).append(str.charAt(start));
                start=pos;
            }
            str=sb.toString();
        }
        return str;
    }
}
//对Integer.toString()以及sb.append().append()API不熟悉
```

## LeetBook之图

1. 省份的数量(重点理解并查集的思想)

```java
class Solution {
    public int findCircleNum(int[][] isConnected) {
        if(isConnected==null||isConnected.length==0) return 0;
        int n = isConnected.length;
        UnionFind uf = new UnionFind(n);
        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                if(isConnected[i][j]==1) uf.union(i,j);
            }
        }
        return uf.getCount();
    }
}
class UnionFind{
    int root[];
    int rank[];
    int count;
    UnionFind(int size){
        root=new int[size];
        rank=new int[size];
        count=size;
        for(int i=0;i<size;i++){
            root[i]=i;
            rank[i]=1;
        }
    }
    //find()函数寻找某个顶点的根节点
    int find(int x){
        if(x==root[x]) return x;
        return root[x]=find(root[x]);
    }
    //合并两个顶点，使得两个顶点的根节点一致
    void union(int x,int y){
        int rootX=find(x);
        int rootY=find(y);
        if(rootX!=rootY){
            if(rank[rootX]>rank[rootY]){
                root[rootY]=rootX;
            }else if(rank[rootX]<rank[rootY]){
                root[rootX]=rootY;
            }else{
                root[rootY]=rootX;
                rank[rootX]+=1;
            }
            count--;
        }
    }

    int getCount(){
        return count;
    }
}
//Notes
1. 并查集代码的基本结构
public class UnionFind{
    //1、构造函数
    public UnionFind(int size){}
    //2、find函数
    public int find(int x){}
    //3、union函数
    public void union(int x,int y){}
    //4、判断两个点是否连通
    public boolean connected(int x,int y){}
}
```

2. 所有可能的路径(编号797)

```java
class Solution {
    public List<List<Integer>> allPathsSourceTarget(int[][] graph) {
        List<List<Integer>> paths = new ArrayList<>();
        if(graph==null||graph.length==0) return paths;
        Queue<List<Integer>> queue = new LinkedList<>();
        List<Integer> path = new ArrayList<>();
        path.add(0);
        queue.add(path);
        while(queue.size()>0){
            List<Integer> currentPath=queue.poll();
            int node=currentPath.get(currentPath.size()-1);
            for(int nextNode:graph[node]){
                List<Integer> tmpPath = new ArrayList<>(currentPath);
                tmpPath.add(nextNode);
                if(nextNode==graph.length-1){
                    paths.add(new ArrayList<>(tmpPath));
                }else{
                    queue.add(new ArrayList<>(tmpPath));
                }
            }
        }
        return paths;
    }
}
//笔记
public static void main(String[] args) {
        int[][] graph={{1,2},{3},{3},{}};
    //graph.length:获取二维数组的行数，{}也算一行
        System.out.println(graph.length);//输出4，而不是3
    }
```

3. 连接所有点的最小费用

```java
class Solution {
    public int minCostConnectPoints(int[][] points) {
        if(points==null||points.length==0) return 0;
        int size=points.length;
        //x和y是两个对象
        //PriorityQueue是一个有序的队列，会按照cost的值给对象在队列内部进行排序
        PriorityQueue<Edge> pq = new PriorityQueue<Edge>((x,y)->x.cost-y.cost);
        UnionFind uf = new UnionFind(size);

        for(int i=0;i<size;i++){
            for(int j=i+1;j<size;j++){
                int[] coordinate1=points[i];
                int[] coordinate2=points[j];
                int cost=Math.abs(coordinate1[0]-coordinate2[0])+Math.abs(coordinate1[1]-coordinate2[1]);
                Edge edge = new Edge(i,j,cost);
                pq.add(edge);
            }
        }
        
        int result=0;
        int count =size-1;
        while(pq.size()>0&&count>0){
            Edge e = pq.poll();
            if(!uf.connected(e.point1,e.point2)){
                uf.union(e.point1,e.point2);
                result+=e.cost;
                count--;
            }
        }
        return result;
    }

    class Edge{
        int point1;
        int point2;
        int cost;
        Edge(int point1,int point2,int cost){
            this.point1=point1;
            this.point2=point2;
            this.cost=cost;
        }
    }

    class UnionFind{
        int root[];
        int rank[];

        public UnionFind(int size){
            root=new int[size];
            rank=new int[size];
            for(int i=0;i<size;i++){
                root[i]=i;
                rank[i]=1;
            }
        }

        public int find(int x){
            if(x==root[x]) return x;
            return root[x]=find(root[x]);
        }

        public void union(int x,int y){
            int rootX=find(x);
            int rootY=find(y);
            if(rootX!=rootY){
                if(rank[rootX]>rank[rootY]){
                    root[rootY]=rootX;
                }else if(rank[rootX]<rank[rootY]){
                    root[rootX]=rootY;
                }else{
                    root[rootY]=rootX;
                    rank[rootX]+=1;
                }
            }
        }

        public boolean connected(int x,int y){
            return find(x)==find(y);
        }
    }
}
//Notes
//Kruskal算法是求解加权无向图的最小生成树的一种算法
```

4. 课程表II

```java
public class CourseTwo {
    // 存储有向图
    List<List<Integer>> edges;
    // 存储每个节点的入度
    int[] indeg;
    // 存储答案
    int[] result;
    // 答案下标
    int index;

    public int[] findOrder(int numCourses, int[][] prerequisites) {
        edges = new ArrayList<List<Integer>>();
        for (int i = 0; i < numCourses; ++i) {
            edges.add(new ArrayList<Integer>());
        }
        indeg = new int[numCourses];
        result = new int[numCourses];
        index = 0;

        for (int[] info : prerequisites) {
            //要上edges[0]中的课程，必须要先修课程0
            //要上edges[1]中的课程，必须要先修课程1
            //要上edges[2]中的课程，必须要先修课程2
            edges.get(info[1]).add(info[0]);
            //求得每个节点的入度
            ++indeg[info[0]];
        }

        Queue<Integer> queue = new LinkedList<Integer>();
        // 将所有入度为 0 的节点放入队列中
        for (int i = 0; i < numCourses; ++i) {
            if (indeg[i] == 0) {
                queue.offer(i);
            }
        }

        while (!queue.isEmpty()) {
            // 从队首取出一个节点
            int u = queue.poll();
            // 放入答案中
            result[index++] = u;
            for (int v: edges.get(u)) {
                --indeg[v];
                // 如果相邻节点 v 的入度为 0，就可以选 v 对应的课程了
                if (indeg[v] == 0) {
                    queue.offer(v);
                }
            }
        }
		//如果输入numCourse=2，prerequisites=[[0,1],[1,0]]，队列里面没有入度为0的节点，此时index=0,numCourse=2
        if (index != numCourses) {
            return new int[0];
        }
        return result;
    }

}
```

## LeetBook之排序算法全解析

1. 把数组排成最小的数：输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个

```java
//冒泡排序
class Solution {
    public String minNumber(int[] nums) {
        bubbleSort(nums);
        String s ="";
        //遍历数组，通过拼接字符串的方式把数组转化为一个字符串
        for (int i = 0; i < nums.length; i++) {
            s=s+nums[i];
        }
        return s;
        //通过toString()方法和正则表达式把数组转化为一个字符串
        //return Arrays.toString(nums).replaceAll("\\[|]|,|\\s","");
    }

    public void bubbleSort(int[] arr){
        boolean swapped=true;
        //循环的轮数
        for(int i=0;i<arr.length;i++){
            if(!swapped) break;
            swapped=false;
            //每一轮比较的次数
            for(int j=0;j<arr.length-1-i;j++){
                //String s =1+"";//s="1"，数字和字符串拼接变成字符串
                if((""+arr[j]+arr[j+1]).compareTo(""+arr[j+1]+arr[j])>0){
                    swap(arr,j,j+1);
                    swapped=true;
                }
            }
        }
    }

    public void swap(int[] arr,int i,int j){
        int temp =arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
}
复杂度分析：
时间复杂度：O(n^2)
空间复杂度：O(1)
//notes:
  public static void main(String[] args) {
        int[] array={1,2,3,4,5};
        System.out.println(Arrays.toString(array));//控制台输出[1, 2, 3, 4, 5]
        System.out.println(Arrays.toString(array).replaceAll("\\[|]|,|\\s", ""));//控制台输出12345
    }
```

2. 移动零：给定一个数组nums，编写一个函数将所有的零移动到数组的末尾，同时保持非零元素的相对顺序

```java
//法一：冒泡排序
class Solution {
    public void moveZeroes(int[] nums) {
        bubbleSort(nums);
    }
    public void bubbleSort(int[] arr){
        boolean swapped =true;
        for(int i=0;i<arr.length;i++){
            if(!swapped) break;
            swapped=false;
            for(int j=0;j<arr.length-1-i;j++){
                if(arr[j]==0&&arr[j+1]!=0){
                    swap(arr,j,j+1);
                    swapped=true;
                }
            }
        }
    }
    //交换两个数
    public void swap(int[] arr,int i,int j){
        int temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }

}
复杂度分析：
T(n)=O(n^2)
S(n)=O(1)
//法二：两次遍历
class Solution {
    public void moveZeroes(int[] nums) {
    //第一次遍历把非零的元素依次放到数组最开头
    int p=0;
    for(int i=0;i<nums.length;i++){
        if(nums[i]!=0){
            nums[p++]=nums[i];
        }
    }

    //第二次从数组下标p开始遍历，把后面的数置为0
    for(int i=p;i<nums.length;i++){
        nums[i]=0;
    }

    }
}
复杂度分析：
    T(n)=O(n)
    S(n)=O(1)
```

3. 数组中的第K个最大元素

```java
//解法一：调用相关的API
class Solution {
    public int findKthLargest(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length-k];
    }
}
复杂度：T(n)=O(nlogn)
//解法二：选择排序法
class Solution {
    public int findKthLargest(int[] nums, int k) {
        //选择排序法
        int maxIndex;
        //轮循k次
        for(int i=0;i<k;i++){
            maxIndex=i;
            for(int j=i+1;j<nums.length;j++){
                if(nums[j]>nums[maxIndex]){
                    maxIndex=j;
                }
            }
            //每一轮把找到的最大元素和首元素交换
            int temp =nums[i];
            nums[i]=nums[maxIndex];
            nums[maxIndex]=temp;
        }
        //返回数组中的第k个元素
        return nums[k-1];    
    }
}
//解法三：堆排序
class Solution {
    public int findKthLargest(int[] nums, int k) {
        buildMaxHeap(nums);
        for(int i=nums.length-1;i>nums.length-k;i--){
            swap(nums,0,i);
            maxHeapify(nums,0,i);
        }
        return nums[0];

    }

    //初始化数组为最大堆
    public void buildMaxHeap(int[] arr){
        //从最后一个非叶子节点开始调整最大堆，根节点下标为0，最后一个非叶子节点的下标就是arr.length/2-1
        for(int i =arr.length/2-1;i>=0;i--){
            maxHeapify(arr,i,arr.length);
        }
    }

    //把以i为根节点的树调整为最大堆
    public void maxHeapify(int[] arr,int i,int heapSize){
        //根节点下标设为0，则左孩子下标l为
        int l=2*i+1;
        //右孩子下标
        int r=l+1;
        //初始化最大值下标biggest为i
        int biggest =i;
        //从根节点，左孩子，右孩子中找出最大值
        if(l<heapSize&&arr[l]>arr[biggest]){
            biggest=l;
        }
        if(r<heapSize&&arr[r]>arr[biggest]){
            biggest=r;
        }
        if(biggest!=i){
            //把最大值移动到根节点上
            swap(arr,biggest,i);
            //递归调用：要保证子树也为最大堆
            maxHeapify(arr,biggest,heapSize);
        }

    }

    public void swap(int[] arr,int i,int j){
        int temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
}
```

4. 排序数组：给你一个整数数组nums，请你将该数组升序排列

```java
//解法一：调用基础类库
class Solution {
    public int[] sortArray(int[] nums) {
        Arrays.sort(nums);
        return nums;
        //return Arrays.sort(nums);报错，因为Arrays.sort()返回的是void
    }
}
//解法二：快速排序（每次取数组中的第一个数为pivot）
class Solution {
    public int[] sortArray(int[] nums) {
        quickSort(nums,0,nums.length-1);
        return nums;
    }

    public static void quickSort(int[] arr,int start,int end){
        //递归函数退出的条件:当剩余区域元素只有一个或者元素个数为0个
        if(start>=end) return;
        //返回主元的下标
        int pivot=partition(arr,start,end);
        quickSort(arr,start,pivot-1);
        quickSort(arr,pivot+1,end);
    }

    public static int partition(int[] arr,int start,int end){
        //选取第一个元素为主元（中枢）
        int pivot=arr[start];
        int left=start+1;
        int right =end;
        while(left<right){
            //找到第一个比pivot大的元素
            while(left<right&&arr[left]<=pivot) left++;
            //如果数组后面的元素都比pivot小，没必要交换
            //将大的元素放到数组末尾
            if(left!=right){
                swap(arr,left,right);
                right--;
            }
        }
        //针对数组中只有最后一个数比pivot大，需要重新在判断一下
        if(left==right&&arr[right]>pivot) right--;
        if(right!=start) swap(arr,start,right);
        return right;
    }

    //交换两个数
    public static void swap(int[] arr,int i,int j){
        int temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
}
```

5. 对链表进行插入排序

```java
public class InsertionSortList {
    public ListNode insertionSortList(ListNode head) {
        if (head == null) return null;
        // 创建哑结点(哑节点又称为哨兵)，用于将在 head 前插入结点转换为在哑结点后插入，统一处理，更方便
        ListNode dummyHead = new ListNode(0);
        dummyHead.next = head;
        // 记录已排序完成的结点末尾
        ListNode lastSorted = head;
        // 当前需要新插入的结点
        ListNode current = head.next;
        while (current != null) {
            if (lastSorted.val <= current.val) {
                // 新插入的值正好是最大值，直接插入链表末尾
                lastSorted = lastSorted.next;
            } else {
                // 从头开始寻找插入位置
                ListNode previous = dummyHead;
                while (previous.next.val <= current.val) {
                    previous = previous.next;
                }
                // 将新结点插入链表
                lastSorted.next = current.next;
                current.next = previous.next;
                previous.next = current;
            }
            // 更新新结点
            current = lastSorted.next;
        }
        return dummyHead.next;
    }
}
```

6. 数组最小的k个数：给定一个数组arr和一个整数k，输出数组arr中最小的k个数

```java
//解法一：堆排序（初始化数组为最大堆）
class Solution {
    public int[] getLeastNumbers(int[] arr, int k) {
        buildMaxHeap(arr);
        //交换arr.length-k次后，arr数组前k个元素为所求的最小的k个数
        for(int i =arr.length-1;i>k-1;i--){
            swap(arr,0,i);
            maxHeap(arr,0,i);
        }
        int[] nums=new int[k];
        for(int i=0;i<k;i++){
            nums[i]=arr[i];
        }
        return nums;
    }

    //初始化数组为最大堆
    public void buildMaxHeap(int[] arr){
        for(int i=arr.length/2-1;i>=0;i--){
            maxHeap(arr,i,arr.length);
        }
    }

    //把以i为根节点的树调整为最大堆
    public void maxHeap(int[] arr,int i,int heapSize){
        //左孩子下标
        int l=2*i+1;
        //右孩子下标
        int r=l+1;
        //最大值下标初始化为i
        int biggest=i;
        //判断
        if(l<heapSize&&arr[l]>arr[biggest]){
            biggest=l;
        }
        if(r<heapSize&&arr[r]>arr[biggest]){
            biggest=r;
        }
        if(biggest!=i){
            //把最大值移动到根节点上
            swap(arr,i,biggest);
            //递归：保证以biggest为根节点的树也为最大堆
            maxHeap(arr,biggest,heapSize);
        }

    }

    //交换两个数
    public void swap(int[] arr,int i,int j){
        int temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
}
//解法二：堆排序（初始化数组为最小堆）
class Solution {
    public int[] getLeastNumbers(int[] arr, int k) {
        buildMinHeap(arr);
        // 调整 k 次
        for (int i = arr.length - 1; i > arr.length - k - 1; i--) {
            swap(arr, 0, i);
            minHeapify(arr, 0, i);
        }
        // 取出 arr 末尾的 k 个元素
        int[] result = new int[k];
        System.arraycopy(arr, arr.length - k, result, 0, k);
        return result;
    }

    // 构建初始小顶堆
    private static void buildMinHeap(int[] arr) {
        // 从最后一个非叶子结点开始调整小顶堆，最后一个非叶子结点的下标就是 arr.length / 2-1
        for (int i = arr.length / 2 - 1; i >= 0; i--) {
            minHeapify(arr, i, arr.length);
        }
    }

    // 调整小顶堆，第三个参数表示剩余未排序的数字的数量，也就是剩余堆的大小
    private static void minHeapify(int[] arr, int i, int heapSize) {
        // 左子结点下标
        int l = 2 * i + 1;
        // 右子结点下标
        int r = l + 1;
        // 记录根结点、左子树结点、右子树结点三者中的最小值下标
        int smallest = i;
        // 与左子树结点比较
        if (l < heapSize && arr[l] < arr[smallest]) {
            smallest = l;
        }
        // 与右子树结点比较
        if (r < heapSize && arr[r] < arr[smallest]) {
            smallest = r;
        }
        if (smallest != i) {
            // 将最小值交换为根结点
            swap(arr, i, smallest);
            // 再次调整交换数字后的小顶堆
            minHeapify(arr, smallest, heapSize);
        }
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

}
```

7. 合并排序的数组：给定两个排序后的数组A和B，其中A的末端有足够的缓冲空间容纳B。编写一个方法，将B合并入A并排序。初始化A和B的元素数量分别为m和n

```java
class Solution {
    public void merge(int[] A, int m, int[] B, int n) {
        int[] C=new int[A.length];
        int p1=0;
        int p2=0;
        int p3=0;
        while(p1<m&&p2<n){
            if(A[p1]<=B[p2]){
                C[p3++]=A[p1++];
            }else{
                C[p3++]=B[p2++];
            }
        }
        //把剩余数放进数组C中
        while(p1<m){
            C[p3++]=A[p1++];
        }
        while(p2<n){
            C[p3++]=B[p2++];
        }
        System.arraycopy(C,0,A,0,C.length);
    }
}
//System.arraycopy()中的arraycopy不要写成了arrayCopy，arraycopy是一个词
```

8. 数组中的逆序对

```java
//解法一：双指针，但是超出时间限制了
class Solution {
    public int reversePairs(int[] nums) {
        int fast=1;
        int slow=0;
        int count=0;
        for(int i=0;i<nums.length-1;i++){
            while(fast<nums.length){
                if(nums[slow]>nums[fast]){
                    count++;
                }
                fast++;
            }
            slow++;
            fast=slow+1;
        }
        return count;
    }
}
//解法二：归并排序(分治思想)
public class ReversePairs {
    int[] nums, temp;
    public int reversePairs(int[] nums) {
        this.nums = nums;
        temp = new int[nums.length];
        return mergeSort(0, nums.length - 1);
    }
    
    private int mergeSort(int l, int r) {
        // 终止条件
        if (l >= r) return 0;
        // 递归划分
        int m = (l + r) / 2;
        int res = mergeSort(l, m) + mergeSort(m + 1, r);
        // 合并阶段
        int i = l, j = m + 1;
        for (int k = l; k <= r; k++)
            temp[k] = nums[k];
        for (int k = l; k <= r; k++) {
            if (i == m + 1)
                nums[k] = temp[j++];
            else if (j == r + 1 || temp[i] <= temp[j])
                nums[k] = temp[i++];
            else {
                nums[k] = temp[j++];
                res += m - i + 1; // 统计逆序对
            }
        }
        return res;
    }
}
```

9. 数组中的多数元素：多数元素指的是数组中出现次数超过[n/2]的元素，即多数元素出现的次数比数组长度的一半还要大

```java
//解法一：调用API库
class Solution {
    public int majorityElement(int[] nums) {
        Arrays.sort(nums);
        //取排序好的中间值即可
        return nums[nums.length/2];
    }
}
//解法二：快速排序算法
class Solution {
    public int majorityElement(int[] nums) {
        quickSort(nums,0,nums.length-1);
        return nums[nums.length/2];
    }

    public void quickSort(int[] arr,int start,int end){
        //递归函数退出的条件
        if(start>=end) return;
        //拿到pivot下标
        int pivot=partition(arr,start,end);
        quickSort(arr,start,pivot-1);
        quickSort(arr,pivot+1,end);
    }

    public int partition(int[] arr,int start,int end){
        //取第一个元素为pivot
        int pivot=arr[start];
        int left=start+1;
        int right=end;
        while(left<right){
            //找到第一个大于pivot的元素
            while(left<right&&arr[left]<=pivot) left++;
            if(left!=right){
                swap(arr,left,right);
                right--;
            }
        }
        if(left==right&&arr[right]>pivot) right--;
        if(right!=start) swap(arr,right,start);
        return right;
    }

    //交换两个数
    public void swap(int[] arr,int i,int j){
        int temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
}
//众数：
一组元素中出现次数最多的元素称为这组元素的众数
//中位数：
一组元素（个数为奇数）从小到大排列，处于中间位置的元素称为中位数
一组元素（个数为偶数数）从小到大排列，处于最中间位置的两个元素的平均数称为中位数
```

10. 最大间距(hard难度)：给定一个无序的数组，找出数组在排序后，相邻元素之间最大的差值

```java
//调用API
class Solution {
    public int maximumGap(int[] nums) {
        if(nums.length<2) return 0;
        Arrays.sort(nums);
        int max=nums[1]-nums[0];
        for(int i=1;i<nums.length-1;i++){
            if((nums[i+1]-nums[i])>max) max=nums[i+1]-nums[i];
        }
        return max;
    }
}
//本题可以用基数排序，理解基数排序的思想即可
```

11. 合并两个有序数组

```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        //创建3个指针
        int p1=0;
        int p2=0;
        int p3=0;
        //开辟一个新的临时数组
        int[] array=new int[m+n];
        while(p1<m&&p2<n){
            if(nums1[p1]<=nums2[p2]){
                array[p3++]=nums1[p1++];
            }else{
                array[p3++]=nums2[p2++];
            }
        }
        //把数组中剩余的数放到临时数组中去
        while(p1<m){
            array[p3++]=nums1[p1++];
        }
        while(p2<n){
            array[p3++]=nums2[p2++];
        }
        //将临时数组拷贝到nums1中
        System.arraycopy(array,0,nums1,0,m+n);
    }
}
//Notes:System.arraycopy(array,0,nums1,0,m+n)等价于下面的代码：
for(int i=0;i<m+n;i++){
	nums1[i]=array[i];
}
```

12. 第一个错误的版本

```java
/* The isBadVersion API is defined in the parent class VersionControl.
      boolean isBadVersion(int version); */
//二分查找法
public class Solution extends VersionControl {
    // Solution object=new Solution();加上这一行执行结果会超出时间限制
    public int firstBadVersion(int n) {
       int left=1;
       int right=n;
       while(left<right){
           //int middle=(right+left)/2;会造成溢出
           int middle=left+(right-left)/2;
           //下面的if条件语句中如果写new Solution().isBadVersion(middle)最后会运行成功
           if(isBadVersion(middle)){
               right=middle;
           }else{
               left=middle+1;
           }
       }
       return left;
    }
}
//logn常见的底一般是2,e,10，他们只相差常数倍，因此没必要纠结logn的底为多少
//二分查找时间复杂度的推导
最坏情况下：
    第1次查找，查询N/2次
    第2次查找，查询N/2^2次
    第3次查找，查询N/2^3次
    ......
    第K次查找，查询N/2^k次
    令N/2^k=1，求得k=log2^n，即时间复杂度为O(logn)
    空间复杂度为O(1)
```

## 排序总结(2021.11.14)

### 1. 冒泡排序

```java
//思想
每一轮逐一比较相邻的两个数，如果左边的数比右边的数大，就交换两个数
//模板
public static void bubbleSort(int[] arr){
    //定义一个标记label
    boolean label = true;
    for(int i=0;i<arr.length;i++){
        //label为false,未发生过交换，说明已经有序，直接break
        if(!label) break;
        label=false;
        //相邻两项逐一进行比较
        for(int j=0;j<arr.length-i-1;j++){
            if(arr[j]>arr[j+1]){
                //把大的数依次放到数组末尾
                swap(arr,j,j+1);
                label=true;
            }
        }
    }
    //交换两个数
    public static void swap(int[] arr,int i,int j){
        int temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
}
//复杂度分析
T(n)=O(n^2),n为数组arr的长度
S(n)=O(1)
```

### 2.选择排序

```java
//思想
双重循环遍历数组，每经过一轮比较，找到最小的那个数，将这个最小数和当前轮次的第一个数进行交换
//模板
public static void selectSort(int[] arr){
    int minIndex;
    for(int i=0;i<arr.length-1;i++){
        //初始化最小值的下标为本轮的第一个数的下标
        minIndex=i;
        for(int j=i+1;j<arr.length;j++){
            //如果有找到比最小值小的数，更新最小值的下标
            if(arr[j]<arr[i]){
                minIndex=j;
            }
        }
        //交换最小值和第一个数
        int temp=arr[i];
        arr[i]=arr[minIndex];
        arr[minIndex]=temp;
    }
}
//复杂度分析
T(n)=O(n^2),n为数组arr的长度
S(n)=O(1)
```

### 3. 插入排序

```java
//思想
可以联想打扑克牌的场景
//模板
public static void insertSort(int[] arr){
	for(int i=0;i<arr.length;i++){
        for(int j=i;j>0&&arr[j]<arr[j-1];j--){
            int temp=arr[j];
            arr[j]=arr[j-1];
            arr[j-1]=temp;
        }
    }
}
//复杂度分析
T(n)=O(n^2),n为数组的长度
S(n)=O(1)
```

### 4.希尔排序

```java
//思想
本质上是对插入排序的一种优化，每轮按照不同的间隔进行排序，最后一个间隔大小为1
//复杂度分析
平均时间复杂度介于O(n)到O(n^2)之间，空间复杂度为O(1)
```

### 5.堆排序

```java
//思想
先把数组初始化为一个最大堆或者最小堆，然后将数组中的最大值交换到数组末尾中去,调整剩余数组，使其成为最大堆
//模板
public static void heapSort(int[] arr){
    //把数组初始化为最大堆
    buildMaxHeap(arr);
    for(int i=arr.length-1;i>0;i--){
        //将数组中的最大值依次交换到数组末尾中去
        swap(arr,0,i);
        //调整剩余数组，使其成为最大堆
        maxHeapify(arr,0,i);
    }
}

//构建初始化最大堆
public static void buildMaxHeap(int[] arr){
    //从最后一个非叶子结点调整最大堆，如果根节点的编号为0，那么最后一个非叶子结点的下标为arr.length/2-1
    for(int i=arr.length/2-1;i>=0;i--){
        maxHeapify(arr,i,arr.length);
    }
}
//调整最大堆，第三个参数是剩余堆的大小
public static void maxHeapify(int[] arr,int i,int heapSize){
    //左子节点的下标
    int left=2*i+1;
    //右子节点的下标
    int right=left+1;
    //初始化最大值的下标为根节点的下标
    int largest=i;
    //与左子树比较
    if(left<heapSize&&arr[left]>arr[largest]){
        largest=left;
    }
    //与右子树比较
    if(right<heapSize&&arr[right]>arr[largest]){
        largest=right;
    }
    if(largest!=i){
        //把最大值放到根节点上面去
        swap(arr,i,largest);
        //递归：确保已largest为根节点的树也为最大堆
        maxHeapify(arr,largest,heapSize);
    }
}
//交换两个数
public static void swap(int[] arr,int i,int j){
    int temp=arr[i];
    arr[i]=arr[j];
    arr[j]=temp;
}
//复杂度分析
时间复杂度分为两个阶段：初始化建堆(buildMaxHeap)和调整堆(maxHeapify)，其中前者复杂度为O(n),后者复杂度为O(nlogn)，当n充分大的时候，nlogn>n，因此时间复杂度为O(nlogn)
空间复杂度为O(1)
```

### 6.快速排序

```java
//思想
1. 在数组中选定一个基数(主元)，英文名为pivot
2. 把比主元小的数放到主元的左边，比主元大的数放到主元的右边，此时数组被一分为2
3. 对左右两个数组重复前面的两个步骤
//模板
public static void quickSort(int[] arr){
    quickSort(arr,0,arr.length-1);
}
public static void quickSort(int[] arr,int start,int end){
    //递归退出的条件
    if(start>=end) return;
    //将数组分区，拿到中间值的下标
    int middle = partition(arr,start,end);
    //对左边区域进行分区
    
    quickSort(arr,start,middle-1);
    //对右边区域进行分区
    quickSort(arr,middle+1,end);
}
public static void partition(int[] arr,int start,int end){
    //取第一个数为基数
    int pivot =arr[start];
    //从第二个数开始分区
    int left=start+1;
    //右边界
    int right=end;
    //left和right相遇时退出循环
    while(left<right){
        //找到第一个大于基数的位置
        while(left<right&&arr[left]<=pivot) left++;
        //交换两个数
        if(left!=right){
            swap(arr,left,right);
            right--;
        }
    }
    //如果left和right相等，单独比较arr[right]和pivot
    if(left==right&&arr[right]>pivot) right--;
    //将基数和中间值交换
    if(right!=start) swap(arr,right,start);
    //返回中间值的下标
    return right;
}
public static void swap(int[] arr,int i,int j){
    int temp=arr[i];
    arr[i]=arr[j];
    arr[j]=temp;
}
//复杂度分析
最坏时间复杂度为O(n^2),平均时间复杂度为O(nlogn),其中n为数组的长度；
空间复杂度为O(logn)~O(n)，平均空间复杂度为O(logn)
```

### 7.归并排序

```java
//合并两个有序链表的思想
开辟一个新的数组，数组的长度等于两个列表的长度之和，创建3个指针，初始时3个指针都指向数组的第一个元素，遍历两个列表，将值小的元素放到新的数组中去，对应的指针加一，最后将剩余的元素放进新开辟的数组中去
//模板
public static int[] mergeTwoList(int[] arr1,int[] arr2){
    //创建3个指针
    int p1=0;
    int p2=0;
    int p3=0;
    //开辟一个新的数组
    int[] result=new int[arr1.length+arr2.length];
    //将值小的数加入到新开辟的数组中去
    while(p1<arr1.length&&p2<arr2.length){
        if(arr1[p1]<arr2[p2]){
            result[p3++]=arr1[p1++];
        }else{
            result[p3++]=arr2[p2++];
        }
    }
    //将剩余数字加进去
    while(p1<arr1.length){
        result[p3++]=arr1[p1++];
    }
    while(p2<arr2.length){
        result[p3++]=arr2[p2++];
    }
    return result;
}
//复杂度分析
时间复杂度为O(m+n)，其中m和n分别为数组arr1和arr2的长度
空间复杂度O(m+n)
//归并排序的思想
将 1 个数字组成的有序数组合并成一个包含 2 个数字的有序数组，再将 2 个数字组成的有序数组合并成包含 4 个数字的有序数组...直到整个数组排序完成
//复杂度分析
时间复杂度为O(nlogn)
空间复杂度为O(n)    
```

### 8.基数排序、桶排序、计数排序

目前了解即可

## LeetBook之哈希表

### 哈希集合

1. 设计哈希集合

```java
//数组实现
class MyHashSet {
    boolean[] nodes = new boolean[1000001];
    public MyHashSet() {

    }
    
    public void add(int key) {
        nodes[key]=true;
    }
    
    public void remove(int key) {
        nodes[key]=false;
    }
    
    public boolean contains(int key) {
        return nodes[key];
    }
}

/**
 * Your MyHashSet object will be instantiated and called as such:
 * MyHashSet obj = new MyHashSet();
 * obj.add(key);
 * obj.remove(key);
 * boolean param_3 = obj.contains(key);
 */
复杂度分析：
T(n)=O(1);
S(n)=O(1)
```

2. 只出现一次的数字:给定一个非空整数数组，除了某个元素只出现一次以外，**其余每个元素均出现两次**。找出那个只出现了一次的元素

```java
//利用哈希表中的哈希集合
class Solution {
    //注意审题：每个元素最多只出现两次，不可能出现三次
    public int singleNumber(int[] nums) {
        //1.创建一个哈希集合
        Set<Integer> hashSet = new HashSet<>();
        for(int i=0;i<nums.length;i++){
            if(!hashSet.contains(nums[i])){
                hashSet.add(nums[i]);
            }else{
                hashSet.remove(nums[i]);
            }
        }
        for(Integer a:hashSet){
            return a;
        }
       //return 后面加任何int范围内的数都可以
       return 1;
    }
}
//HashSet里面没有get()方法，HashMap中才有get()方法
//HashSet中的add()方法返回的是boolean类型
T(n)=O(n),其中n为数组nums的长度
s(n)=O(n)
```

3. 存在重复元素：一个整数数组，如果有一个值出现了至少2次，函数返回true，如果每个元素都不相同，函数返回false

```java
哈希表中的哈希集合
class Solution {
    public boolean containsDuplicate(int[] nums) {
        HashSet<Integer> set=new HashSet<>();
        for(int i=0;i<nums.length;i++){
            if(!set.contains(nums[i])){
                set.add(nums[i]);
            }else{
                return true;
            }
        }
        return false;
    }
}
//复杂度分析
T(n)=O(n),n为数组的长度
S(n)=O(n)
```

4. 两个数组的交集

```java
//哈希表中的哈希集合
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        HashSet<Integer> set1 = new HashSet<>();//会带来空间开销
        HashSet<Integer> set2 = new HashSet<>();//会带来空间开销
        //未想到重新new一个哈希集合的对象
        HashSet<Integer> set3 = new HashSet<>();//会带来空间开销
        for(int i=0;i<nums1.length;i++){
            set1.add(nums1[i]);
        }
        for(int i=0;i<nums2.length;i++){
            set2.add(nums2[i]);
        }
        for(Integer x:set2){
            if(set1.contains(x)){
                //未想到把两者的交集放到一个哈希集合中去，这样通过size()方法就可以轻松的求出交集的个数了
                set3.add(x);
            }
        }
        //不知道新定义的数组长度怎样取
        int[] array = new int[set3.size()];//会带来空间开销
        int index=0;
        for(Integer a:set3){
            array[index++]=a;
        }
        return array;
    }
}
//复杂度
T(n)=O(m+n),m和n分别为数组nums1和nums2的长度
S(n)=O(m+n)
```

5. 快乐数

```java
//错误解答，会导致堆栈溢出
public class Test {
    public boolean isHappy(int n) {
        //happyRecursively(n);如果输入19，这一行代码的值为true(而不是return true),针对isHappy这个函数来说并没有结束，还会往下执行，除非把这一行代码改成return happyRecursively(n);
        return happyRecursively(n);
        //return false;
    }
    public boolean happyRecursively(int n){
        List<Integer> list = new ArrayList<>();
        int res=0;
        while(n!=0){
            int remainder=n%10;
            list.add(remainder);
            n/=10;
        }
        for(Integer k:list){
            res+=k*k;//求每一位的平方和可以在上面的while循环中实现，没必要建一个list
        }
        if(res!=1){
            happyRecursively(res);
        }
        return true;
    }
}
//正确解答：哈希表中的哈希集合
class Solution {
    private int getNext(int n) {
        int totalSum = 0;
        while (n > 0) {
            int d = n % 10;
            n = n / 10;
            totalSum += d * d;
        }
        return totalSum;
    }

    public boolean isHappy(int n) {
        Set<Integer> seen = new HashSet<>();
        while (n != 1 && !seen.contains(n)) {
            seen.add(n);
            n = getNext(n);
        }
        return n == 1;//想不到这样的写法
    }
}
```

### 哈希映射

1. 两数之和

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer,Integer> hashTable = new HashMap<>();
        for(int i=0;i<nums.length;i++){
            //如果把数组中的元素值存在value中，索引存在key中会很麻烦
            if(hashTable.containsKey(target-nums[i])){
                //java中使用new int[]{};是声明一个匿名数组
                return new int[]{i,hashTable.get(target-nums[i])};
            }
            hashTable.put(nums[i],i);
        }
        return new int[0];//等价于return new int[]{}
    }
}
复杂度分析：
时间复杂度为O(n),其中n为数组nums的长度
空间复杂度O(n)，哈希表的空间开销
```

2. 同构字符串(要理解题意)

```java
class Solution {
    public boolean isIsomorphic(String s, String t) {
        HashMap<Character, Character> s1 = new HashMap<>();
        HashMap<Character, Character> t1 = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char a=s.charAt(i);
            char b=t.charAt(i);
            if(s1.containsKey(a)&&s1.get(a)!=b||t1.containsKey(b)&&t1.get(b)!=a) return false;
            s1.put(a,b);
            t1.put(b,a);
        }
        return true;
    }
}
复杂度分析：
时间复杂度为O(n)，其中n为s的长度(s和t长度相等)
空间复杂度O(|Σ|),Σ是字符串的字符集
```

3. 两个列表的最小索引总和

```java
class Solution {
    public String[] findRestaurant(String[] list1, String[] list2) {
//关键：哈希表中的key存的是索引的和，而value存的是一个list，保存两个列表中相同的字符串
        HashMap<Integer, List<String>> map = new HashMap<>();
        for (int i = 0; i < list1.length; i++) {
            for (int j = 0; j < list2.length; j++) {
                if(list1[i].equals(list2[j])){
                    if(!map.containsKey(i+j)){
                        map.put(i+j,new ArrayList<String>());
                    }
                    map.get(i+j).add(list2[j]);
                }
            }
        }
        int minIndexSum=2000;
        //map.keySet()将哈希表中的所有键存储在一个集合中
        //遍历所有的key,从其中找到最小的key
        for (Integer key : map.keySet()) {
            minIndexSum=Math.min(minIndexSum,key);
        }
        String[] res = new String[map.get(minIndexSum).size()];
        //list.toArray(res):会将list转换为一个String数组
        return map.get(minIndexSum).toArray(res);
    }
}
```

1. 两个数组的交集

```java
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        HashMap<Integer,Integer> map1=new HashMap<>();
        HashMap<Integer,Integer> map2=new HashMap<>();
        List<Integer> list = new ArrayList<>();
         //将数组nums1加入map1，key存的是数组中的元素，value存的是该元素出现的次数
        for(int i=0;i<nums1.length;i++){
            if(!map1.containsKey(nums1[i])){
                map1.put(nums1[i],1);
            }else{
                int a = map1.get(nums1[i]);
                map1.put(nums1[i],a+1);
            }
        }
        //将数组nums2加入map2
        for(int i=0;i<nums2.length;i++){
            if(!map2.containsKey(nums2[i])){
                map2.put(nums2[i],1);
            }else{
                int b = map2.get(nums2[i]);
                map2.put(nums2[i],b+1);
            }
        }
        //遍历map1
        for(int key1:map1.keySet()){
            if(map2.containsKey(key1)){
                int count=Math.min(map1.get(key1),map2.get(key1));
                for(int i=0;i<count;i++){
                    list.add(key1);
                }
            }
        }
        int[] array = new int[list.size()];
        //通过for循环遍历list，将其中的值放在int数组array中
        for(int i=0;i<list.size();i++){
            array[i]=list.get(i);
        }
        return array;
    }
}
//解法二：和解法一的区别在于新建了一个intersection数组，存放两数组的交集，数组的长度不超过nums1或nums2数组的长度，最后通过Arrays.copyOfRange()这个API来返回一个新的数组
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        int index=0;
        int[] intersection = new int[nums1.length];
        HashMap<Integer,Integer> map1=new HashMap<>();
        HashMap<Integer,Integer> map2=new HashMap<>();
        //将数组nums1加入map1，key存的是数组中的元素，value存的是该元素出现的次数
        for(int i=0;i<nums1.length;i++){
            if(!map1.containsKey(nums1[i])){
                map1.put(nums1[i],1);
            }else{
                int a = map1.get(nums1[i]);
                map1.put(nums1[i],a+1);
            }
        }
        //将数组nums2加入map2
        for(int i=0;i<nums2.length;i++){
            if(!map2.containsKey(nums2[i])){
                map2.put(nums2[i],1);
            }else{
                int b = map2.get(nums2[i]);
                map2.put(nums2[i],b+1);
            }
        }
        //遍历map1
        for(int key1:map1.keySet()){
            if(map2.containsKey(key1)){
                int count=Math.min(map1.get(key1),map2.get(key1));
                for(int i=0;i<count;i++){
                    intersection[index++]=key1;
                }
            }
        }
        return Arrays.copyOfRange(intersection,0,index);
    }
}
```

5. 存在重复的元素II：给定一个整数数组和一个整数k，判断数组中是否存在两个不同的索引i和j，使得nums[i]=nums[j]，并且i和j的差的绝对值至多为k

```java
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        //关键：k中存元素，v中存索引
        HashMap<Integer,List<Integer>> map = new HashMap<>();
        for(int i=0;i<nums.length;i++){
            if(!map.containsKey(nums[i])){
                //ArrayList<Object> list = new ArrayList<>(parameter);其中parameter可以指定ArrayList的容量
                map.put(nums[i],new ArrayList<>());
                map.get(nums[i]).add(i);
            }else{
                map.get(nums[i]).add(i);
                // map.put(nums[i],map.get(nums[i]).add(i));map.get(nums[i]).add(i)的返回类型是boolean类型，而map中的v存储的是一个List<Integer>
            }
        } 
        //再一次遍历数组
        for(int i =0;i<nums.length;i++){
            if(map.get(nums[i]).size()>1){
                for(int a=0;a<map.get(nums[i]).size();a++){
                    for(int b=a+1;b<map.get(nums[i]).size();b++){
                        //求a的绝对值：Math.abs(a)
                        if(Math.abs((int)map.get(nums[i]).get(a)-(int)map.get(nums[i]).get(b))<=k){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}
//使用HashSet，主要思想：滑动窗口
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        HashSet<Integer> set = new HashSet<>();
        for(int i=0;i<nums.length;i++){
            if(set.contains(nums[i])){
                return true;
            }
            set.add(nums[i]);
            if(set.size()>k){
                set.remove(nums[i-k]);//思路奇特
            }
        }
        return false;
    }
}
//复杂度分析
时间复杂度：O(n)，其中n为数组nums的长度
空间复杂度：O(m),m为哈希表中存储的元素个数
```

6. 字母异位词分组

```java
//解法一：
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        //建一个哈希表
        HashMap<String,List<String>> map = new HashMap<>();
        //遍历strs数组
        for(String s:strs){
            //将字符串变为字符数组
            char[] a =s.toCharArray();
            //对字符数组进行排序
            Arrays.sort(a);
            //将排好序的字符数组变为字符串
            String key = new String(a);//不熟悉new String(a)API,a为一个字符数组
            List<String> list = new ArrayList<>();
            if(!map.containsKey(key)){
                list.add(s);
                map.put(key,list);
            }else{
                map.get(key).add(s);
            }
        }
        //不熟悉new ArrayList<>(map.values())API
        return new ArrayList<>(map.values());
    }
}
时间复杂度：O(mnlogn)，其中m是字符串数组strs的长度，n是最长的字符串长度
空间复杂度：O(mn)
//解法二：仅对解法一中的代码进行了简化
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        //建一个哈希表
        HashMap<String,List<String>> map = new HashMap<>();
        //遍历strs数组
        for(String s:strs){
            //将字符串变为字符数组
            char[] a =s.toCharArray();
            //对字符数组进行排序
            Arrays.sort(a);
            //将排好序的字符数组变为字符串
            String key = new String(a);
            List<String> list = map.getOrDefault(key,new ArrayList<String>());
            list.add(s);
            map.put(key,list);
        }
        //不熟悉new ArrayList<>(map.values())API
        return new ArrayList<>(map.values());
    }
}
```

7. 寻找重复的子树

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    HashMap<String,Integer> count;
    List<TreeNode> ans;
    public List<TreeNode> findDuplicateSubtrees(TreeNode root) {
        count = new HashMap<>();
        ans = new ArrayList<>();
        collectRecursively(root);
        return ans;
    }
    public String collectRecursively(TreeNode node){
        if(node==null) return "#";
        //将每一棵子树序列化
        String serial = node.val+","+collectRecursively(node.left)+","+collectRecursively(node.right);
        //关键:将子树序列化的结果存入HashMap中的key中
        count.put(serial,count.getOrDefault(serial,0)+1);
        if(count.get(serial)==2){
            ans.add(node);
        }
        return serial;
    }
}
时间复杂度：O(n^2)，n为树的结点个数
空间复杂度：O(n^2)
```

### 小结

1. 宝石与石头

```java
//解法一：HashMap
class Solution {
    public int numJewelsInStones(String jewels, String stones) {
        HashMap<Character,Integer> map = new HashMap<>();
        int res=0;
        for(int i=0;i<stones.length();i++){
            char s=stones.charAt(i);
            if(!map.containsKey(s)){
                map.put(s,1);
            }else{
                map.put(s,map.getOrDefault(s,0)+1);
            }           
        }
        for(int i=0;i<jewels.length();i++){
            char s=jewels.charAt(i);
            if(map.containsKey(s)){
                res+=map.get(s);
            }
        }
        return res;
    }
}
//解法二：HashSet
public class JewelsWithStones {
    public int numJewelsInStones(String jewels, String stones) {
        //初始化宝石数量为0
        int res=0;
        //将jewels中的字符存入HashSet中
        HashSet<Character> set = new HashSet<>();
        for (int i = 0; i < jewels.length(); i++) {
            char s=jewels.charAt(i);
            set.add(s);
        }
        //遍历stones
        for (int i = 0; i < stones.length(); i++) {
            char s=stones.charAt(i);
            if(set.contains(s)){
                res++;
            }
        }
        return res;
    }
}
时间复杂度：O(m+n)，其中m和n分别是字符串jewels和stones的长度
空间复杂度：O(m)，主要为哈希表的空间开销
```

2. 无重复字符的最长字串

```java
   /**
     * 思想：滑动窗口（类似队列）
     * @param s
     * @return
     */
    public int lengthOfLongestSubstring(String s){
        //创建哈希表，其中k存储字符，v存储索引
        HashMap<Character, Integer> map = new HashMap<>();
        //初始化结果为0
        int max=0;
        //定义一个滑动窗口的指针
        int left=0;
        //遍历字符串
        for (int i = 0; i < s.length(); i++) {
            if(map.containsKey(s.charAt(i))){
                //如果left=map.get(s.charAt(i))+1，没有考虑到s="abba"的情况
                left=Math.max(left,map.get(s.charAt(i))+1);//巧妙
            }
            map.put(s.charAt(i),i);
            //如果用队列来模拟滑动窗口比作一，那么i-left+1为此时队列的大小
            max=Math.max(max,i-left+1);
        }
        return max;
    }
```
