import redis
cn = redis.Redis("127.0.0.1", 6379, 0)
print(cn.keys())