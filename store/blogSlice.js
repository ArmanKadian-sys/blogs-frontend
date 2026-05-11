import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async () => {
    const res = await fetch("https://blogs.armanapp3.xyz/api/blogs",{
      method:"GET", 
    });
    const data=await res.json();

    if(res.status==200){
      console.log("this is data", data);
      return data
      
    }
    throw new Error(data.message);
  }
);


export const fetchUser = createAsyncThunk(
  "blog/fetchUser",
  async () => {
    const token=localStorage.getItem("token");
    const res = await fetch("https://blogs.armanapp3.xyz/api/getUser",{
      method:"GET", 
      headers:
      {
        Authentication: "Bearer"+ " " + token
      }
    });
    const data=await res.json();

    if(res.status==200){
      return data
    }
    throw new Error(data.message);
  }
);












const initialState={
  user:null,
  errors:null,
  blogs:[],
  isLoading:false,
  isLoadingUser:false,
  errorsUser:null,
}

const blogSlice=createSlice({
  name:"blog",
  initialState,
  reducers:{
    deleteBlog:(state, action)=>{
      const id=action.payload.id;
      state.blogs=state.blogs.filter((blog)=>{
        if(blog._id==id){
          return false;
        }
        else{
          return true;
        }
      state.user.blogs=state.user.blogs.filter((blog)=>{
        if(blog==id){
          return false;
        }
        else{
          return true;
        }
      })
      
    })},
    updateBlog:(state, action)=>{

      const newBlog=action.payload.blog;
      const id=action.payload.id;

      if(action.payload.user){
        state.user=action.payload.user;
      }

      state.blogs=state.blogs.map((blog)=>{
        if(blog._id==id){
          return newBlog;
        }
        else{
          return blog;
        }
      })
},

clearState:(state, action)=>{
  state.user=null;
},

    addBlog:(state, action)=>{
      state.blogs=[...state.blogs, action.payload.blog];
      state.user=action.payload.newUser;
    }
  },
   extraReducers: (builder) => {
      builder.addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
      });
      builder.addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs;
      });
      builder.addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.error.message;
      });
      builder.addCase(fetchUser.pending, (state) => {
        state.isLoadingUser = true;
      });
      builder.addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoadingUser = false;
        state.user = action.payload.result;
      });
      builder.addCase(fetchUser.rejected, (state, action) => {
        state.isLoadingUser = false;
        state.errorsUser = action.error.message;
      });
  },

})

export const {deleteBlog, updateBlog, 
addBlog, clearState}=blogSlice.actions;


export default blogSlice.reducer;
